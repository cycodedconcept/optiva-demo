import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
  loading: false,
  error: null,
  success: false,
  sortValue: [],
  card: {},
  currentPage: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
}

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
      });
      
      // Store data for details view
      localStorage.setItem("sortItem", JSON.stringify(response.data.data));
      
      return {
        data: response.data,
        page: response.data.page || page,
        per_page: response.data.per_page || per_page,
        total: response.data.total || 0,
        total_pages: response.data.total_pages || 1
      };
    } catch (error) {
      // Improved error handling
      console.error("API Error:", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: error.message || "Something went wrong while fetching orders"
      });
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
      });
      return response.data;
    } catch (error) {
      console.error("Update Status Error:", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: error.message || "Something went wrong while updating order status"
      });
    }
  }
);

const sortedSlice = createSlice({
  name: 'sorted',
  initialState,
  reducers: {
    clearSortedState: (state) => {
      return {
        ...initialState
      };
    }
  },
  extraReducers: (builder) => {
    builder
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
        
    })
      .addCase(getSortedValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "An unknown error occurred" };
      })
      .addCase(sortUpdateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sortUpdateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(sortUpdateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "An unknown error occurred" };
      });
  }
});

export const { clearSortedState } = sortedSlice.actions;
export default sortedSlice.reducer;