import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carsReducer from './slices/carsSlice';
import bookingsReducer from './slices/bookingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    bookings: bookingsReducer,
  },
});

export default store;
