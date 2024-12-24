import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '../services/budgetService';

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await budgetService.getAllBudgets();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/create',
  async (budgetData, thunkAPI) => {
    try {
      const response = await budgetService.createBudget(budgetData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editBudget = createAsyncThunk(
  'budgets/update',
  async ({ id, budgetData }, thunkAPI) => {
    try {
      const response = await budgetService.updateBudget(id, budgetData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeBudget = createAsyncThunk(
  'budgets/delete',
  async (id, thunkAPI) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  budgets: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    reset: (state) => {
      state.budgets = [];
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.budgets = [];
      })
      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update budget
      .addCase(editBudget.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(editBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.budgets.findIndex(budget => budget._id === action.payload._id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(editBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete budget
      .addCase(removeBudget.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(removeBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = state.budgets.filter(budget => budget._id !== action.payload);
      })
      .addCase(removeBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = budgetSlice.actions;
export default budgetSlice.reducer;
