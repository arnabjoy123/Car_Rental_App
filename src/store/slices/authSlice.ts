import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mockLogin, mockSignup } from '../../services/apiService';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials) => {
    const response = await mockLogin(credentials);
    return response;
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (data) => {
    const response = await mockSignup(data);
    return response;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  // No storage now, just reset state
  return { loggedIn: false, user: null, expiresAt: null };
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    user: null,
    expiresAt: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loggedIn = false;
        state.user = null;
        state.expiresAt = null;
        state.error = null;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
