import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    customers: [],
    custom: [],
    loading: false,
    error: null,
    success: false,
}

export const getCustomers = createAsyncThunk(
    'customer/getCustomers',
    async ({token}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_allcustomer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            localStorage.setItem("customer", JSON.stringify(response.data));
            return response.data

        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const addCustomers = createAsyncThunk(
    'customer/addCustomers',
    async({token, cData}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/save_customer_info`, 
                cData,
                {
                headers: {
                    "Content-Type": "application/json",
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

export const searchCustomer = createAsyncThunk(
    'customer/searchCustomer',
    async({token, search_value}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_allcustomer?search_value=${search_value}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getCustomers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = action.payload
        })
        .addCase(getCustomers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addCustomers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload
        })
        .addCase(addCustomers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(searchCustomer.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.custom = action.payload
        })
        .addCase(searchCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default customerSlice.reducer;
