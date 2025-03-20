import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    categories: [],
    loading: false,
    error: null,
    success: false,
}

export const createCategory = createAsyncThunk(
    'category/createCategories',
    async ({token, category_name}, { rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/create_category`, {
                category_name
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const getCategories = createAsyncThunk(
    'category/getCategories',
    async ({token}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_category`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            localStorage.setItem("allCategories", JSON.stringify(response.data))

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({token, cat_id, category_name}, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/update_category`, {
                cat_id,
                category_name
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async ({token, cat_id}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/delete_category?cat_id=${cat_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createCategory.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(createCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.success = action.payload
        })
        .addCase(createCategory.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
        .addCase(getCategories.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.categories = action.payload
        })
        .addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
        .addCase(updateCategory.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(updateCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.success = action.payload
        })
        .addCase(updateCategory.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
        .addCase(deleteCategory.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.success = action.payload
        })
        .addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
    }
})

export default categorySlice.reducer;
