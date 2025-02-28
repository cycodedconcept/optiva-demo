import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    purchase: [],
    error: null,
    success: false,
    loading: false,
    currentPage: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
};

export const getPurchase = createAsyncThunk(
    'purchase/getPurchase',
    async ({token, shop_id, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/getall_purchase`, {
                params: {
                    shop_id: shop_id,
                    page: page,
                    per_page: per_page
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            localStorage.setItem("pur", JSON.stringify(response.data.data));
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

export const createPurchase = createAsyncThunk(
    'purchase/createPurchase',
    async({token, pData}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/create_purchase`, pData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
); 

export const updatePurchase = createAsyncThunk(
    'purchase/updatePurchase',
    async ({token, upData}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/create_purchase`, upData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
          return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getPurchase.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getPurchase.fulfilled, (state, action) => {
            state.loading = false;
            state.purchase = action.payload;
            state.currentPage = action.payload.page;
            state.total_pages = action.payload.total_pages;
            state.total = action.payload.total;
            state.per_page = action.payload.per_page;
        })
        .addCase(getPurchase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createPurchase.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createPurchase.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(createPurchase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updatePurchase.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePurchase.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(updatePurchase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default purchaseSlice.reducer;
