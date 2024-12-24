import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { transactionService } from '../services/transactionService';

// Async thunk actions
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async () => {
        const response = await transactionService.getAllTransactions();
        return response.data || [];
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (transactionData) => {
        const response = await transactionService.addTransaction(transactionData);
        return response.data;
    }
);

export const editTransaction = createAsyncThunk(
    'transactions/editTransaction',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }
            const response = await transactionService.updateTransaction(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeTransaction = createAsyncThunk(
    'transactions/removeTransaction',
    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }
            await transactionService.deleteTransaction(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    transactions: [],
    totalIncome: 0,
    totalExpense: 0,
    dateRange: {
        startDate: '',
        endDate: ''
    },
    filters: {
        category: null,
        type: 'all',
    },
    status: 'idle',
    error: null
};

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setDateRange: (state, action) => {
            state.dateRange = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions = Array.isArray(action.payload) ? action.payload : [];
                
                // Tính toán tổng thu/chi dựa trên giá trị amount
                state.totalIncome = state.transactions
                    .filter(t => t.amount > 0)
                    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
                    
                state.totalExpense = state.transactions
                    .filter(t => t.amount < 0)
                    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create transaction
            .addCase(createTransaction.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions.push(action.payload);
                
                // Update totals
                if (action.payload.amount > 0) {
                    state.totalIncome += parseFloat(action.payload.amount);
                } else {
                    state.totalExpense += Math.abs(parseFloat(action.payload.amount));
                }
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Edit transaction
            .addCase(editTransaction.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.transactions.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    // Remove old amounts from totals
                    const oldTransaction = state.transactions[index];
                    if (oldTransaction.amount > 0) {
                        state.totalIncome -= parseFloat(oldTransaction.amount);
                    } else {
                        state.totalExpense -= Math.abs(parseFloat(oldTransaction.amount));
                    }
                    
                    // Add new amounts to totals
                    if (action.payload.amount > 0) {
                        state.totalIncome += parseFloat(action.payload.amount);
                    } else {
                        state.totalExpense += Math.abs(parseFloat(action.payload.amount));
                    }
                    
                    // Update transaction
                    state.transactions[index] = action.payload;
                }
            })
            .addCase(editTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Remove transaction
            .addCase(removeTransaction.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeTransaction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const transaction = state.transactions.find(t => t.id === action.payload);
                if (transaction) {
                    // Update totals before removing
                    if (transaction.amount > 0) {
                        state.totalIncome -= parseFloat(transaction.amount);
                    } else {
                        state.totalExpense -= Math.abs(parseFloat(transaction.amount));
                    }
                    
                    // Remove transaction
                    state.transactions = state.transactions.filter(t => t.id !== action.payload);
                }
            })
            .addCase(removeTransaction.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setFilters, clearFilters, setDateRange } = transactionSlice.actions;

// Memoized selectors
const selectTransactions = state => state.transactions.transactions;
const selectFilters = state => state.transactions.filters;
const selectDateRange = state => state.transactions.dateRange;

export const selectFilteredTransactions = createSelector(
    [selectTransactions, selectFilters, selectDateRange],
    (transactions, filters, dateRange) => {
        if (!Array.isArray(transactions)) return [];
        
        return transactions.filter(transaction => {
            if (filters.category && transaction.category !== filters.category) return false;
            if (dateRange.startDate && new Date(transaction.date) < new Date(dateRange.startDate)) return false;
            if (dateRange.endDate && new Date(transaction.date) > new Date(dateRange.endDate)) return false;
            if (filters.type !== 'all' && transaction.type !== filters.type) return false;
            return true;
        });
    }
);

export default transactionSlice.reducer;
