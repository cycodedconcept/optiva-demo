import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    payment: [],
    search: [],
    fillItem: [],
    success: false,
    error: null,
    loading: false,
    isSearching: false,

    currentPage: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,

    fillCurrentPage: 1,
    fillPerPage: 10,
    fillTotal: 0,
    fillTotalPages: 0,

    sCurrentPage: 1,
    sPerPage: 10,
    sTotal: 0,
    sTotalPages: 0,
}

export const getPayments = createAsyncThunk(
    'payment/getPayments',
    async ({token, shop_id, page = 1, per_page = 10 }, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_allpayment`, {
                params: {
                    shop_id: shop_id,
                    page: page,
                    per_page: per_page,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            localStorage.setItem("payment", JSON.stringify(response.data));
            return {
                data: response.data.data,
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

export const searchPayment = createAsyncThunk(
    'payment/searchPayment',
    async({token, shop_id, search_value, page = 1, per_page = 10}, { rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_allpayment`, {
                params: {
                    shop_id: shop_id,
                    search_value,
                    page: page,
                    per_page: per_page
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.setItem("payment", JSON.stringify(response.data));
            return {
                data: response.data.data,
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

export const filterPayment = createAsyncThunk(
    'payment/filterPayment',
    async({token, shop_id, search_value, page = 1, per_page = 10}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_allpayment`, {
                params: {
                    shop_id: shop_id,
                    search_value,
                    page: page,
                    per_page: per_page
                },
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
            localStorage.setItem("payment", JSON.stringify(response.data));
            return {
                data: response.data.data,
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
)

export const updatePaymentPin = createAsyncThunk(
    'payment/updatePaymentPin',
    async ({token, invoice_number, pin}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/validate_update_payment_pin`, {
                invoice_number,
                pin
            },
        {
            headers: {
                Authorization: `Bearer ${token}`
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

export const updatePaymentStatus = createAsyncThunk(
    'payment/updatePaymentStatus',
    async ({token, invoice_number, shop_id, status}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/update_payment_status`, {
                invoice_number,
                shop_id,
                status
            },
        {
            headers: {
                Authorization: `Bearer ${token}`
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

export const cancelPaymentPinProcess = createAsyncThunk(
    'payment/cancelPaymentPinProcess',
    async ({token, invoice_number}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/cancel_validate_update_payment_pin_process`, {
                invoice_number
            },
        {
            headers: {
                Authorization: `Bearer ${token}`
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
)

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearPayment: (state) => {
            state.isSearching = false;
            state.search = [];
            state.currentPage = 1;
            state.total = 0;
            state.total_pages = 0
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPayments.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getPayments.fulfilled, (state, action) => {
            state.loading = false;
            state.payment = action.payload.data;
            state.currentPage = action.payload.page;
            state.total_pages = action.payload.total_pages;
            state.total = action.payload.total;
            state.per_page = action.payload.per_page;
            state.isSearching = false;
        })
        .addCase(getPayments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(searchPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchPayment.fulfilled, (state, action) => {
            state.loading = false;
            state.search = action.payload.data;
            state.sCurrentPage = action.payload.page;
            state.sTotalPages = action.payload.total_pages;
            state.sTotal = action.payload.total;
            state.sPerPage = action.payload.per_page;
        })
        .addCase(searchPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(updatePaymentPin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePaymentPin.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(updatePaymentPin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updatePaymentStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePaymentStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(updatePaymentStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(cancelPaymentPinProcess.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(cancelPaymentPinProcess.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(cancelPaymentPinProcess.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(filterPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(filterPayment.fulfilled, (state, action) => {
            state.loading = false;
            state.fillItem = action.payload.data;
            // Update pagination values based on filtered data
            state.fillCurrentPage = action.payload.page || 1;
            state.fillPerPage = action.payload.per_page || 10; // Default to 10 items per page
            state.fillTotal = action.payload.total || 0;
            
            // If there are no results or total is 0, set total_pages to 1, otherwise use the response value or calculate it
            state.fillTotalPages = (!action.payload.data || action.payload.data.length === 0 || action.payload.total === 0)
                ? 1 
                : (action.payload.total_pages || Math.ceil((action.payload.total || 0) / (action.payload.per_page || 10)));
        })
        .addCase(filterPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
    }
})

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;

