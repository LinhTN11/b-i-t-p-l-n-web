import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './transactionSlice';
import budgetReducer from './budgetSlice';
import userReducer from './userSlice';
import calendarReducer from './calendarSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    budgets: budgetReducer,
    user: userReducer,
    calendar: calendarReducer,
  },
});
