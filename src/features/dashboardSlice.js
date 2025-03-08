import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    success: false,
    error: null,
    loading: false,
    item: [],
    payments: {}
}

export const getDashData = createAsyncThunk(
    'dashboard/getDashData',
    async({token, shop_id}, {rejectWithValue}) => {
        try {
        const response = await axios.get(`${API_URL}/get_dashboard_summary_data`, {
            params: {
                shop_id
            },
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

export const getLatestItems = createAsyncThunk(
    'dashboard/getLatestItems',
    async({token, shop_id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/latest_payment_and_invoice`, {
                params: {shop_id},
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

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getDashData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getDashData.fulfilled, (state, action) => {
            state.loading = false;
            state.item = action.payload;
        })
        .addCase(getDashData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getLatestItems.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getLatestItems.fulfilled, (state, action) => {
            state.loading = false;
            state.payments = action.payload;
        })
        .addCase(getLatestItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default dashboardSlice.reducer;