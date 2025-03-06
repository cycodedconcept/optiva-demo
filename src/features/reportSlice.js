import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../config/constant';
import axios from 'axios';

const initialState = {
    stockSummary: [],
    summaryItem: [],
    salesCard: [],
    sales: [],
    sValue: [],
    card: {},
    error: null,
    success: false,
    loading: false,
    isSummary: false,

    currentPage: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,

    summaryCurrentPage: 1,
    summaryPerPage: 10,
    summaryTotal: 0,
    summaryTotalPages: 0,

    salesCurrentPage: 1,
    salesPerPage: 10,
    salesTotal: 0,
    salesTotalPages: 0,

    sCurrentPage: 1,
    sPerPage: 10,
    sTotal: 0,
    sTotalPages: 0
};

export const getStockSummary = createAsyncThunk(
    'purchase/getStockSummary',
    async({ token, shop_id, month, year, page = 1, per_page = 10 }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/stock_summary`, {
                params: { shop_id, page, per_page, month, year },
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem("stock", JSON.stringify(response.data));

            return {
                data: response.data.stock_summary.data, 
                page: response.data.stock_summary.page,
                per_page: response.data.stock_summary.per_page,
                total: response.data.stock_summary.total,
                total_pages: response.data.stock_summary.total_pages,
                cardData: {
                    totalitemsinstock: response.data.totalitemsinstock,
                    totalitemsin: response.data.totalitemsin,
                    totalitemsout: response.data.totalitemsout,
                    totalclosingStock: response.data.totalclosingStock,
                }
            };
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const summaryData = createAsyncThunk(
    'report/summaryData',
    async({token, summary_id, page = 1, per_page = 10}, { rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_stock_movement`, {
                params: {
                    summary_id: summary_id,
                    page: page,
                    per_page: per_page
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return {
                data: response.data.data,
                page: response.data.page,
                per_page: response.data.per_page,
                total: response.data.total,
                total_pages: response.data.total_pages
            }
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const getSalesChart = createAsyncThunk(
    'report/getSalesChart',
    async ({token, shop_id, month, year}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_sales_summary_report`, {
                params: {
                    shop_id,
                    month,
                    year,
                },
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

export const getSales = createAsyncThunk(
    'report/getSales',
    async({token, shop_id, month, year, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_sales_record`, {
                params: {
                    shop_id,
                    month,
                    year,
                    page,
                    per_page
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            localStorage.setItem("sale", JSON.stringify(response.data.data))
            return {
                data: response.data.data,
                page: response.data.page,
                per_page: response.data.per_page,
                total: response.data.total,
                total_pages: response.data.total_pages
            }
        } catch (error) {
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

export const getSearchValueData = createAsyncThunk(
    'report/getSearchValueData',
    async({token, shop_id, month, year, search_value, page = 1, per_page = 10}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${API_URL}/get_sales_record`, {
                params: {
                    shop_id,
                    month,
                    year,
                    search_value,
                    page,
                    per_page
                }, 
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return {
                data: response.data.data,
                page: response.data.page,
                per_page: response.data.per_page,
                total: response.data.total,
                total_pages: response.data.total_pages
            }
        } catch (error) {
            
        }
    }
)

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        // clearSummary: (state) => {
        //     state.isSummary = false;
        //     state.summaryItem = [];
        //     state.currentPage = 1;
        //     state.total = 0;
        //     state.total_pages = 0
        // },
        setSalesCurrentPage: (state, action) => {
            state.salesCurrentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getStockSummary.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getStockSummary.fulfilled, (state, action) => {
            state.loading = false;
            state.stockSummary = action.payload.data;
            state.card = action.payload.cardData;

            state.currentPage = action.payload.page || 1;
            state.total_pages = action.payload.total_pages || 1;
            state.total = action.payload.total || 0;
            state.per_page = action.payload.per_page || 10;
        })
        .addCase(getStockSummary.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong';
        })
        .addCase(summaryData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(summaryData.fulfilled, (state, action) => {
            state.loading = false;
            state.summaryItem = action.payload.data;
        
            state.summaryCurrentPage = action.payload.page || 1;
            state.summaryTotalPages = action.payload.total_pages || 1;
            state.summaryTotal = action.payload.total || 0;
            state.summaryPerPage = action.payload.per_page || 10;
        })        
        .addCase(summaryData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(getSalesChart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getSalesChart.fulfilled, (state, action) => {
            state.loading = false;
            state.salesCard = action.payload;
        })
        .addCase(getSalesChart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(getSales.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getSales.fulfilled, (state, action) => {
            state.loading = false;
            state.sales = action.payload.data;
            state.salesCurrentPage = action.payload.page || 1;
            state.salesTotalPages = action.payload.total_pages || 1;
            state.salesTotal = action.payload.total || 0;
            state.salesPerPage = action.payload.per_page || 10;
        })
        .addCase(getSales.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
        .addCase(getSearchValueData.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getSearchValueData.fulfilled, (state, action) => {
            state.loading = false;
            state.sValue = action.payload.data;
            state.sCurrentPage = action.payload.page || 1;
            state.sTotalPages = action.payload.total_pages || 1;
            state.sTotal = action.payload.total || 0;
            state.sPerPage = action.payload.per_page || 10;
        })
        .addCase(getSearchValueData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong'
        })
    }
});

export const { clearSummary, setSalesCurrentPage } = reportSlice.actions;
export default reportSlice.reducer;
