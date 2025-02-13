import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
  invoice: [],
  products: [],
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
            console.log(response.data)
            return {
                data: response.data,
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

export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({token, shop_id}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_products?shop_id=${shop_id}&page=All`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
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
          state.error = action.payload || 'Something went wrong'
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
    }
})

export const { clearSearch } = invoiceSlice.actions;
export default invoiceSlice.reducer;