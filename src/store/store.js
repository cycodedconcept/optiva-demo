import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/userSlice';
import supplierReducer from '../features/supplierSlice';
import categoryReducer from '../features/categorySlice';
import productReducer from '../features/productSlice';
import customerReducer from '../features/customerSlice';
import invoiceReducer from '../features/invoiceSlice'

const store = configureStore({
  reducer: {
    user: loginReducer,
    supplier: supplierReducer,
    category: categoryReducer,
    product: productReducer,
    customer: customerReducer,
    invoice: invoiceReducer
  },
});

export default store;
