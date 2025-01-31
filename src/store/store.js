import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/userSlice';
import supplierReducer from '../features/supplierSlice'

const store = configureStore({
  reducer: {
    user: loginReducer,
    supplier: supplierReducer
  },
});

export default store;
