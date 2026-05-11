import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    access_token: localStorage.getItem('access_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
  },
  reducers: {
    // Cập nhật thông tin user và token sau khi đăng nhập thành công
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('access_token', payload.access_token);
    },
    // Đăng xuất và xóa thông tin khỏi store + localStorage
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('access_token');
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setError, clearError } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
