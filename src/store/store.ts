import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carsReducer from './slices/carsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
  },
});

export default store;
