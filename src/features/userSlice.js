import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';


const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: false,
    allUsers: [],
    shopItem: null,
    selectedShop: null,
    userRole: [],
    shops: [],
    message: {}

}

export const loginForm = createAsyncThunk(
    'user/login',
    async ({ login, password }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/login_user`, {
                login,
                password,
            });

            console.log('Response data:', response.data);

            // const { user } = response.data;

            // if (!token || !user) {
            //     throw new Error('Login failed. Please check your credentials.');
            // }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user))

            // return { user };
            return response.data;
        } 
        catch (error) {
            console.error('Error response:', error.response || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async({token, id}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_users?shop_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
);

export const shopUser = createAsyncThunk(
    'user/shopUser',
    async({token, shop_id}, { rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_users?shop_id=${shop_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserRole = createAsyncThunk(
    'user/getUserRole',
    async ({token}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_users_role`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getShop = createAsyncThunk(
    'user/getShop',
    async({token}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/get_shops`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createUsers = createAsyncThunk(
    'user/createUsers',
    async ({ email, phone_number, user_name, password, role_type_id, shop_id, role_priviledge_ids, token }, thunkAPI) => {
      try {
        const requestData = { email, phone_number, user_name, password, role_type_id, shop_id, role_priviledge_ids };
  
        console.log('Sending request to create user:', requestData);
  
        const response = await axios.post(`${API_URL}/create_user`, 
            requestData, 
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
  
        return response.data;
      } catch (error) {
        console.error('Error in createUsers:', error);
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async ({token, user_id, shop_id}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/delete_user`, {
                user_id,
                shop_id
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);



const loginSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // logoutUser: (state) => {
        //     state.user = null;
        //     state.token = null;
        //     localStorage.removeItem('token');
        // },
        setSelectedShop: (state, action) => {
            state.selectedShop = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(loginForm.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(loginForm.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.user = action.payload
        })
        .addCase(loginForm.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
        .addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.allUsers = action.payload;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
        .addCase(shopUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(shopUser.fulfilled, (state, action) => {
            state.loading = false;
            state.shopItem = action.payload;
        })
        .addCase(shopUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getUserRole.pending, (state) => {
            state.error = null;
        })
        .addCase(getUserRole.fulfilled, (state, action) => {
            state.success = true;
            state.userRole = action.payload
        })
        .addCase(getUserRole.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(getShop.pending, (state) => {
            state.error = null;
        })
        .addCase(getShop.fulfilled, (state, action) => {
            state.success = true;
            state.shops = action.payload
        })
        .addCase(getShop.rejected, (state, action) => {
            state.error = action.payload;
        })
        .addCase(createUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload
        })
        .addCase(createUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { logoutUser, setSelectedShop } = loginSlice.actions;
export default loginSlice.reducer;
