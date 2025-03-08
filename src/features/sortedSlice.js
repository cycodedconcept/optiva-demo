import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  success: false,
  isSearching: false,
  sort: [],
  sortValue: [],
  card: {},
  currentPage: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
}

export const getSorted = createAsyncThunk(
    'sort/getSorted',
    async ({token, shop_id, search_value, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
           const response = await axios.get(`${API_URL}/getall_orders`, {
            params: {
                shop_id,
                page,
                per_page,
                search_value
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
           }) 
           localStorage.setItem("sortItem", JSON.stringify(response.data.data));
           return {
            data: response.data,
            page: response.data.data.page,
            per_page: response.data.per_page,
            total: response.data.total,
            total_pages: response.data.total_pages
          };
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    } 
);

export const getSortedValue = createAsyncThunk(
    'sort/getSortedValue',
    async ({token, shop_id, search_value, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
           const response = await axios.get(`${API_URL}/getall_orders`, {
            params: {
                shop_id,
                page,
                per_page,
                search_value
            },
            headers: {
                Authorization: `Bearer ${token}`,
            }
           }) 
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

export const sortUpdateStatus = createAsyncThunk(
    'sort/sortUpdateStatus',
    async({token, sorted_status, invoice_number}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/update_orders_status`, {
                params: {
                    sorted_status,
                    invoice_number
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
)

const sortedSlice = createSlice({
    name: 'sorted',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.isSearching = false;
            state.sort = [];
            state.currentPage = 1;
            state.total = 0;
            state.total_pages = 0
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getSorted.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getSorted.fulfilled, (state, action) => {
            state.loading = false;
            const paginationInfo = action.payload.data.data;
            state.sort = action.payload.data.data;
            state.card = action.payload.data;

            state.currentPage = paginationInfo.page || 1;
            state.total_pages = paginationInfo.total_pages || 1;
            state.total = paginationInfo.total || 0;
            state.per_page = paginationInfo.per_page || 10;
            
            state.isSearching = false;
          })
          .addCase(getSorted.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(getSortedValue.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getSortedValue.fulfilled, (state, action) => {
            state.loading = false;
            const paginationInfo = action.payload.data.data;
            state.sortValue = action.payload.data.data;
            state.card = action.payload.data;

            state.currentPage = paginationInfo.page || 1;
            state.total_pages = paginationInfo.total_pages || 1;
            state.total = paginationInfo.total || 0;
            state.per_page = paginationInfo.per_page || 10;
            
            state.isSearching = true;
          })
          .addCase(getSortedValue.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(sortUpdateStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(sortUpdateStatus.fulfilled, (state, action) => {
            state.loading = true;
            state.success = action.payload;
          })
          .addCase(sortUpdateStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
    }
})

export const { clearSearch } = sortedSlice.actions;
export default sortedSlice.reducer;