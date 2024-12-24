import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token'),
    avatar: null,
    userData: null
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    clearUserData: (state) => {
      state.token = null;
      state.avatar = null;
      state.userData = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
  }
});

export const { setToken, setAvatar, setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
