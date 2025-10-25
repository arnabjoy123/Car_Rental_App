import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mockLogin, mockSignup } from '../../services/apiService';
import MMKVStorage from '../../services/mmkv';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async credentials => {
    const response = await mockLogin(credentials);
    MMKVStorage.set('session', JSON.stringify(response));
    return response;
  },
);

export const signupUser = createAsyncThunk('auth/signupUser', async data => {
  const response = await mockSignup(data);
  MMKVStorage.set('session', JSON.stringify(response));
  return response;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  MMKVStorage.delete('session');
  return { loggedIn: false, user: null, expiresAt: null };
});

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
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
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
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loggedIn = false;
        state.user = null;
        state.expiresAt = null;
      });
  },
});

export default authSlice.reducer;
