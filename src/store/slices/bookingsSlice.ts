import { createSlice } from '@reduxjs/toolkit';

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    allBookings: [], // store all completed bookings
  },
  reducers: {
    addBooking: (state, action) => {
      const safeBooking = JSON.parse(JSON.stringify(action.payload));
      state.allBookings.push(safeBooking);
    },
    clearBookings: state => {
      state.allBookings = [];
    },
  },
});

export const { addBooking, clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;
