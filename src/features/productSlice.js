import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
  products: [],
  loading: false,
  error: null,
  success: false,
  currentPage: 1,
  per_page: 10,
  pre_page: null,
  next_page: null,
  total: 0,
  total_pages: 0,
}

export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({token, shop_id, page = 1, per_page = 10}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_products`, {
                params: {
                    shop_id: shop_id,
                    page: page,
                    per_page: per_page
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            localStorage.setItem("product", JSON.stringify(response.data.data));
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

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async ({formData, token}, { rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/create_product`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log(response.data)
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({ token, uForm}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/edit_product`, uForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.data;
            state.currentPage = action.payload.page;
            state.per_page = action.payload.per_page;
            state.total = action.payload.total;
            state.total_pages = action.payload.total_pages;
        })
        .addCase(getProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload;
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export default productSlice.reducer;
