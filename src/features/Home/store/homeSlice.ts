import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiHomeService } from '@features/Home/services/apiHomeServices';
import { appService } from '@core/services/appService';

interface AddDevicePayload {
    owner_id: number;
    status: string;
    hourly_rate: number;
    location: string;
    last_active: string;
}

interface DeviceData {
    id: number;
    owner_id: number;
    status: string;
    hourly_rate: number;
    location: string;
    last_active: string;
}

export const addDevice = createAsyncThunk(
    'home/addDevice',
    async (payload: AddDevicePayload, { rejectWithValue }) => {
        try {
            await appService.appLog('Attempting to add device...');
            const response = await apiHomeService.addDevice(payload);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`Add device failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Device added successfully');
            return response;
        } catch (error: any) {
            await appService.appLog(`Add device error: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error',
                data: null
            });
        }
    }
);

interface HomeState {
    loading: boolean;
    error: string | null;
    currentDevice: DeviceData | null;
    devices: DeviceData[];
}

const initialState: HomeState = {
    loading: false,
    error: null,
    currentDevice: null,
    devices: []
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomeState: (state) => {
            state.loading = false;
            state.error = null;
        },
        clearCurrentDevice: (state) => {
            state.currentDevice = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addDevice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addDevice.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.currentDevice = action.payload.data;
                    state.devices.push(action.payload.data);
                }
            })
            .addCase(addDevice.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.msg || 'Unknown error';
            });
    },
});

const persistConfig = {
    key: 'home',
    storage,
    whitelist: ['devices'], // Chỉ lưu trữ danh sách devices
};

export const { clearHomeState, clearCurrentDevice } = homeSlice.actions;
export const homeReducer = persistReducer(persistConfig, homeSlice.reducer);