import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { mockLogin, mockSignup } from '../../services/apiService';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockLogin(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const signupUser = createAsyncThunk('auth/signupUser', async data => {
  const response = await mockSignup(data);
  return response;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  // No storage now, just reset state
  return { loggedIn: false, user: null, expiresAt: null };
});

export const loadUserFromStorage = () => {
  const loggedIn = storage.getString('loggedIn');
  const user = storage.getString('user');
  const expiresAt = storage.getString('expiresAt');

  if (loggedIn && user) {
    return {
      loggedIn: true,
      user: JSON.parse(user),
      expiresAt: Number(expiresAt),
      loading: false,
      error: null,
    };
  }

  return {
    loggedIn: false,
    user: null,
    expiresAt: null,
    loading: false,
    error: null,
  };
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: loadUserFromStorage(),
  reducers: {
    hydrate: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder

      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
        state.expiresAt = action.payload.expiresAt;

        //////////////

        storage.set('loggedIn', 'true');
        storage.set('user', JSON.stringify(action.payload.user));
        storage.set('expiresAt', String(action.payload.expiresAt));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Signup
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = action.payload.loggedIn;
        state.user = action.payload.user;
        state.expiresAt = action.payload.expiresAt;

        //////////////////////////

        storage.set('loggedIn', 'true');
        storage.set('user', JSON.stringify(action.payload.user));
        storage.set('expiresAt', String(action.payload.expiresAt));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.loggedIn = false;
        state.user = null;
        state.expiresAt = null;
        state.error = null;
        state.loading = false;

        //////////////////

        storage.clearAll();
      });
  },
});

export const { hydrate } = authSlice.actions;

export default authSlice.reducer;
