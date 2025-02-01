import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/userSlice';
import supplierReducer from '../features/supplierSlice';
import categoryReducer from '../features/categorySlice'

const store = configureStore({
  reducer: {
    user: loginReducer,
    supplier: supplierReducer,
    category: categoryReducer
  },
});

export default store;
