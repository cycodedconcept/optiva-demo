import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    supplier: [],
    loading: false,
    error: null,
    success: false,
    countryData: []
};

export const getAllSuppliers = createAsyncThunk(
    'supplier/getAllSuppliers',
    async ({token, id}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_suppliers?shop_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            localStorage.setItem("allSuppliers", JSON.stringify(response.data))


            return response.data;
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

export const getCountries = createAsyncThunk(
    'supplier/getCountries',
    async (_, { rejectWithValue}) => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/states', {
          headers: {
            'Content-Type': 'application/json',
        }
        })
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  )

const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(getAllSuppliers.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(getAllSuppliers.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.supplier = action.payload;
        })
        .addCase(getAllSuppliers.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
        .addCase(getCountries.pending, (state) => {
            state.success = false;
            state.error = null;
        })
        .addCase(getCountries.fulfilled, (state, action) => {
            state.success = true;
            state.countryData = action.payload;

            if (action.payload && Array.isArray(action.payload.data)) {
              localStorage.setItem('fetchedData', JSON.stringify(action.payload.data));
            } else {
              console.error("Fetched data is not in the expected format:", action.payload);
            }
      
        })
        .addCase(getCountries.rejected, (state, action) => {
            state.success = false;
            state.error = action.payload || 'Something went wrong';
        })
    }
})

export default supplierSlice.reducer;