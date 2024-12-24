import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedMonth: new Date().toISOString(), // Store as ISO string
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      // Convert to ISO string if a Date object is passed
      state.selectedMonth = action.payload instanceof Date 
        ? action.payload.toISOString() 
        : action.payload;
    },
  },
});

export const { setSelectedMonth } = calendarSlice.actions;
export default calendarSlice.reducer;
