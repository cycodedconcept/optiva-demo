import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    payment: [],
    search: [],
    success: '',
    error: null,
    loading: false,
    isSearching: false,

    currentPage: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
}

export const getPayments = createAsyncThunk(
    'payment/getPayments',
    async ({token, shop_id, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_allpayment`, {
                params: {
                    shop_id: shop_id,
                    page: page,
                    per_page: per_page
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
            console.log(response.data)
            return response.data
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

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
            state.currentPage = action.payload.page;
            state.total_pages = action.payload.total_pages;
            state.total = action.payload.total;
            state.per_page = action.payload.per_page;
            state.isSearching = true;
        })
        .addCase(searchPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
    }
})

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;

