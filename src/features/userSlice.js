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
    async ({ login, password }, {rejectWithValue}) => {
        try {
            const response = await axios.post(`${API_URL}/login_user`, {
                login,
                password,
            });

            console.log('Response data:', response.data);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user))

            // return { user };
            return response.data;
        } 
        catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
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
            localStorage.setItem("allUsers", JSON.stringify(response.data))


            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
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
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
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
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
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
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

  
export const createUsers = createAsyncThunk(
    'user/createUsers',
    async (userData, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const myHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const raw = JSON.stringify({
                email: userData.email,
                phone_number: userData.phone_number,
                user_name: userData.user_name,
                password: userData.password,
                role_type_id: userData.role_type_id,
                role_privilege_ids: userData.role_priviledge_ids,
                shop_id: userData.shop_id
            });

            const response = await fetch(`${API_URL}/create_user`, {
                method: 'POST',
                headers: myHeaders,
                body: raw
            });

            const result = await response.json();


            if (!response.ok) {
                throw new Error(result.message || 'Failed to create user');
            }

            return result;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
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
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const updatePassword = createAsyncThunk(
    'user/update',
    async ({token, id, password}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/update_user_password`, {
                id,
                password
            },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
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

export const updateUsers = createAsyncThunk(
    'user/updateUsers',
    async(upUserData, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const upId = localStorage.getItem("dtid")
            const myHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            const raw = JSON.stringify({
                id: upId,
                email: upUserData.email,
                phone_number: upUserData.phone_number,
                user_name: upUserData.user_name,
                password: upUserData.password,
                role_type_id: upUserData.role_type_id,
                role_privilege_ids: upUserData.role_priviledge_ids,
                shop_id: upUserData.shop_id
            });

            const response = await fetch(`${API_URL}/update_user`, {
                method: 'POST',
                headers: myHeaders,
                body: raw
            });

            const result = await response.json();

            console.log('Payload:', raw);
            console.log('API Response:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update user');
            }

            return result;

        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
)

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
        .addCase(updatePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload
        })
        .addCase(updatePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload
        })
        .addCase(updateUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { logoutUser, setSelectedShop } = loginSlice.actions;
export default loginSlice.reducer;
