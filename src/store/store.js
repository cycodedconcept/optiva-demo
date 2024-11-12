import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from '../features/exampleSlice';

const store = configureStore({
  reducer: {
    example: exampleReducer,
  },
});

export default store;
