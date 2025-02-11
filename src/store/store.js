import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/userSlice';
import supplierReducer from '../features/supplierSlice';
import categoryReducer from '../features/categorySlice';
import productReducer from '../features/productSlice'
import customerReducer from '../features/customerSlice'

const store = configureStore({
  reducer: {
    user: loginReducer,
    supplier: supplierReducer,
    category: categoryReducer,
    product: productReducer,
    customer: customerReducer
  },
});

export default store;
