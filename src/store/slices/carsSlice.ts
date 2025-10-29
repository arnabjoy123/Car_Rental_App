import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import data from '../../mocks/cars.json';

// Simulate an API delay using a timeout
export const fetchCars = createAsyncThunk('cars/fetchCars', async () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 500); // 1s simulated delay
  });
});

const carSlice = createSlice({
  name: 'cars',
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCars.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      });
  },
});

export default carSlice.reducer;
