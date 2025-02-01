import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    supplier: [],
    user:[],
    loading: false,
    error: null,
    success: false,
    countryData: [],
    supplier_name: '',
    supplier_email: '',
    supplier_phonenumber: '',
    country: '',
    state: '',
    shop_id: []
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
);

export const createSupplier = createAsyncThunk(
    'supplier/createSupplier',
    async ({token, supplier_name, supplier_email, supplier_phonenumber, shop_id, country, state}, {rejectWithValue}) => {
        try {
            const myHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const profile = JSON.stringify({
                supplier_name,
                supplier_email,
                supplier_phonenumber,
                shop_id,
                country,
                state
            })

            const response = await fetch(`${API_URL}/create_supplier`, {
                method: "POST",
                headers: myHeaders,
                body: profile
            });

            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                throw new Error(data.message || "Failed to create supplier");
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const updateSupplier = createAsyncThunk(
    'supplier/updateSupplier',
    async ({token, supplier_id, supplier_name, supplier_email, supplier_phonenumber, shop_id, country, state }, { rejectWithValue }) => {
        try {
            const myHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };
            const profile = JSON.stringify({
                supplier_id,
                supplier_name,
                supplier_email,
                supplier_phonenumber,
                shop_id,
                country,
                state
            });

            const response = await fetch(`${API_URL}/update_supplier`, {
                method: "POST",
                headers: myHeaders,
                body: profile
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create supplier");
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        resetSupplierState: (state) => {
            state.supplier_name = '';
            state.supplier_email = '';
            state.supplier_phonenumber = '';
            state.country = '';
            state.state = '';
            state.shop_id = [];
            state.success = false;
            state.error = null;
        }
    },

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
        .addCase(createSupplier.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(createSupplier.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload;
        })
        .addCase(createSupplier.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateSupplier.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(updateSupplier.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload;
        })
        .addCase(updateSupplier.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { resetSupplierState } = supplierSlice.actions;
export default supplierSlice.reducer;