import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
  invoice: [],
  products: [],
  discountItem: [],
  card: {},
  loading: false,
  error: null,
  success: false,
  isSearching: false,

  currentPage: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
}

export const getInvoice = createAsyncThunk(
    'invoice/getInvoice',
    async({token, shop_id, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_allinvoice`, {
                params: {
                    shop_id: shop_id,
                    page: page,
                    per_page: per_page
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            localStorage.setItem("invoice", JSON.stringify(response.data.data));
            return {
                data: response.data,
                page: response.data.page,
                per_page: response.data.per_page,
                total: response.data.total,
                total_pages: response.data.total_pages
            };
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const getProduct = createAsyncThunk(
    'invoice/getProduct',
    async ({token, shop_id, page}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_products?shop_id=${shop_id}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const createInvoice = createAsyncThunk(
    'invoice/createInvoice',
    async ({token, invoiceData}, { rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/create_invoice`, invoiceData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            localStorage.setItem("info", JSON.stringify(response.data))
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const getDiscount = createAsyncThunk(
    'invoice/getDiscount',
    async({token}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_discount`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            localStorage.setItem("dis", JSON.stringify(response.data))
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const createDiscount = createAsyncThunk(
    'invoice/createDiscount',
    async({token, discountData}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/create_discount`, discountData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const updateDiscount = createAsyncThunk(
    'invoice/updateDiscount',
    async({token, updateData}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/update_discount`, updateData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const updateInvoice = createAsyncThunk(
    'invoice/updateInvoice',
    async({token, updateData}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/update_invoice`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const validatePin = createAsyncThunk(
    'invoice/validatePin',
    async ({token, invoice_number, pin}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/validate_invoice_payment_pin`, {
                invoice_number,
                pin
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const invoicePaymentStatus = createAsyncThunk(
    'invoice/invoicePaymentStatus',
    async ({token, invoice_number, shop_id, status}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/update_invoice_payment_status`, {
                invoice_number,
                shop_id,
                status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const cancelValidatePin = createAsyncThunk(
    'invoice/cancelValidatePin',
    async ({token, invoice_number}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/cancel_validate_invoice_pin`, {invoice_number}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);


const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.isSearching = false;
            state.invoice = [];
            state.currentPage = 1;
            state.total = 0;
            state.total_pages = 0
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getInvoice.fulfilled, (state, action) => {
            state.loading = false;
            const paginationInfo = action.payload.data.data; 
            state.invoice = action.payload.data.data.data;
            state.card = action.payload;
        
            state.currentPage = paginationInfo.page || 1;
            state.total_pages = paginationInfo.total_pages || 1;
            state.total = paginationInfo.total || 0;
            state.per_page = paginationInfo.per_page || 10;
            
            state.isSearching = false;
        })
        .addCase(getInvoice.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Something went wrong';
        })
        .addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(getProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createInvoice.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(createInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getDiscount.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getDiscount.fulfilled, (state, action) => {
            state.loading = false;
            state.discountItem = action.payload;
        })
        .addCase(getDiscount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createDiscount.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createDiscount.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(createDiscount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateDiscount.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateDiscount.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(updateDiscount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateInvoice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateInvoice.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(updateInvoice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(validatePin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(validatePin.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(validatePin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(invoicePaymentStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(invoicePaymentStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(invoicePaymentStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(cancelValidatePin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(cancelValidatePin.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(cancelValidatePin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { clearSearch } = invoiceSlice.actions;
export default invoiceSlice.reducer;


