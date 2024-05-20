// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Data/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
