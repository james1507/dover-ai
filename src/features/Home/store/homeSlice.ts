import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiHomeService } from '@features/Home/services/apiHomeServices';
import { appService } from '@core/services/appService';
// Import types from the new types file
import { 
    AddDevicePayload, 
    DeviceData, 
    AddCpuPayload, 
    CpuData, 
    DeviceCpuData,
    DeviceCpuResponse,
    AddGpuPayload,
    DeviceGpuResponse,
    DeviceGpuData,
    AddDiskPayload,
    DeviceDiskResponse,
    DeviceDiskData,
    AddDiskAndLinkPayload,
    AddRamAndLinkPayload,
    DeviceRamResponse,
    DeviceRamData
} from "@features/Home/types";

// Define a new interface for the combined payload
interface AddCpuAndLinkPayload {
    cpuPayload: AddCpuPayload;
    deviceId: number;
}

// Define a new interface for the combined GPU payload
interface AddGpuAndLinkPayload {
    gpuPayload: AddGpuPayload;
    deviceId: number;
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

// --- New Thunks ---
export const addCpu = createAsyncThunk<
    DeviceCpuResponse | any, // Return type of the thunk (success or error response)
    AddCpuAndLinkPayload, // Payload type for the thunk
    { rejectValue: any }
>(
    'home/addCpu',
    async (payload: AddCpuAndLinkPayload, { rejectWithValue }) => {
        try {
            // Call the combined service method
            const response = await apiHomeService.deviceCpu(payload.cpuPayload, payload.deviceId);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`DeviceCpu operation failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Device and CPU linked successfully via combined thunk');
            return response; // Return the success response from the service
        } catch (error: any) {
            await appService.appLog(`DeviceCpu operation error in thunk: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error in DeviceCpu thunk',
                data: null
            });
        }
    }
);

// New Thunk for adding GPU and linking to device
export const addGpuAndLink = createAsyncThunk<
    DeviceGpuResponse | any, // Return type of the thunk (success or error response)
    AddGpuAndLinkPayload, // Payload type for the thunk
    { rejectValue: any }
>(
    'home/addGpuAndLink',
    async (payload: AddGpuAndLinkPayload, { rejectWithValue }) => {
        try {
            // Call the combined service method for GPU
            const response = await apiHomeService.deviceGpu(payload.gpuPayload, payload.deviceId);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`DeviceGpu operation failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Device and GPU linked successfully via combined thunk');
            return response; // Return the success response from the service
        } catch (error: any) {
            await appService.appLog(`DeviceGpu operation error in thunk: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error in DeviceGpu thunk',
                data: null
            });
        }
    }
);

// New Thunk for adding Disk and linking to device
export const addDiskAndLink = createAsyncThunk<
    DeviceDiskResponse | any, // Return type of the thunk (success or error response)
    AddDiskAndLinkPayload, // Payload type for the thunk
    { rejectValue: any }
>(
    'home/addDiskAndLink',
    async (payload: AddDiskAndLinkPayload, { rejectWithValue }) => {
        try {
            // Call the combined service method for Disk
            const response = await apiHomeService.deviceDisk(payload.diskPayload, payload.deviceId);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`DeviceDisk operation failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Device and Disk linked successfully via combined thunk');
            return response; // Return the success response from the service
        } catch (error: any) {
            await appService.appLog(`DeviceDisk operation error in thunk: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error in DeviceDisk thunk',
                data: null
            });
        }
    }
);

// New Thunk for adding RAM and linking to device
export const addRamAndLink = createAsyncThunk<
    DeviceRamResponse | any, // Return type of the thunk (success or error response)
    AddRamAndLinkPayload, // Payload type for the thunk
    { rejectValue: any }
>(
    'home/addRamAndLink',
    async (payload: AddRamAndLinkPayload, { rejectWithValue }) => {
        try {
            // Call the combined service method for RAM
            const response = await apiHomeService.deviceRam(payload.ramPayload, payload.deviceId);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`DeviceRam operation failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Device and RAM linked successfully via combined thunk');
            return response; // Return the success response from the service
        } catch (error: any) {
            await appService.appLog(`DeviceRam operation error in thunk: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error in DeviceRam thunk',
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
    // --- New state fields ---
    cpuLoading: boolean;
    cpuError: string | null;
    currentCpu: CpuData | null;
    deviceCpuLoading: boolean;
    deviceCpuError: string | null;
    currentDeviceCpuLink: DeviceCpuData | null;
    gpuLoading: boolean;
    gpuError: string | null;
    currentGpuLink: DeviceGpuData | null;
    diskLoading: boolean;
    diskError: string | null;
    currentDiskLink: DeviceDiskData | null;
    // --- New state fields for RAM ---
    ramLoading: boolean;
    ramError: string | null;
    currentRamLink: DeviceRamData | null;
    // --------------------------------
}

const initialState: HomeState = {
    loading: false,
    error: null,
    currentDevice: null,
    devices: [],
    // --- New initial state ---
    cpuLoading: false,
    cpuError: null,
    currentCpu: null,
    deviceCpuLoading: false,
    deviceCpuError: null,
    currentDeviceCpuLink: null,
    gpuLoading: false,
    gpuError: null,
    currentGpuLink: null,
    diskLoading: false,
    diskError: null,
    currentDiskLink: null,
    // --- New initial state for RAM ---
    ramLoading: false,
    ramError: null,
    currentRamLink: null,
    // ----------------------------------
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearHomeState: (state) => {
            state.loading = false;
            state.error = null;
            // --- Clear new state fields ---
            state.cpuLoading = false;
            state.cpuError = null;
            state.currentCpu = null;
            state.deviceCpuLoading = false;
            state.deviceCpuError = null;
            state.currentDeviceCpuLink = null;
            state.gpuLoading = false;
            state.gpuError = null;
            state.currentGpuLink = null;
            state.diskLoading = false;
            state.diskError = null;
            state.currentDiskLink = null;
            // --- Clear new state fields for RAM ---
            state.ramLoading = false;
            state.ramError = null;
            state.currentRamLink = null;
            // ------------------------------------
        },
        clearCurrentDevice: (state) => {
            state.currentDevice = null;
        },
        clearCurrentCpu: (state) => {
            state.currentCpu = null;
        },
        clearCurrentGpuLink: (state) => {
            state.currentGpuLink = null;
        },
        clearCurrentDiskLink: (state) => {
            state.currentDiskLink = null;
        },
        clearCurrentRamLink: (state) => {
            state.currentRamLink = null;
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
            })
            // --- New Extra Reducers ---
            .addCase(addCpu.pending, (state) => {
                state.cpuLoading = true;
                state.cpuError = null;
            })
            .addCase(addCpu.fulfilled, (state, action) => {
                state.cpuLoading = false;
                 if (action.payload.data) {
                    state.currentCpu = action.payload.data;
                }
            })
            .addCase(addCpu.rejected, (state, action: any) => {
                state.cpuLoading = false;
                state.cpuError = action.payload?.msg || 'Unknown error';
            })
            // Extra Reducers for addGpuAndLink
            .addCase(addGpuAndLink.pending, (state) => {
                state.gpuLoading = true;
                state.gpuError = null;
            })
            .addCase(addGpuAndLink.fulfilled, (state, action) => {
                state.gpuLoading = false;
                if (action.payload.data) {
                    state.currentGpuLink = action.payload.data;
                }
            })
            .addCase(addGpuAndLink.rejected, (state, action: any) => {
                state.gpuLoading = false;
                state.gpuError = action.payload?.msg || 'Unknown error';
            })
            // Extra Reducers for addDiskAndLink
            .addCase(addDiskAndLink.pending, (state) => {
                state.diskLoading = true;
                state.diskError = null;
            })
            .addCase(addDiskAndLink.fulfilled, (state, action) => {
                state.diskLoading = false;
                if (action.payload.data) {
                    state.currentDiskLink = action.payload.data;
                }
            })
            .addCase(addDiskAndLink.rejected, (state, action: any) => {
                state.diskLoading = false;
                state.diskError = action.payload?.msg || 'Unknown error';
            })
            // Extra Reducers for addRamAndLink (New)
            .addCase(addRamAndLink.pending, (state) => {
                state.ramLoading = true;
                state.ramError = null;
            })
            .addCase(addRamAndLink.fulfilled, (state, action) => {
                state.ramLoading = false;
                if (action.payload.data) {
                    state.currentRamLink = action.payload.data;
                }
            })
            .addCase(addRamAndLink.rejected, (state, action: any) => {
                state.ramLoading = false;
                state.ramError = action.payload?.msg || 'Unknown error';
            });
            // --------------------------------------------------
    },
});

const persistConfig = {
    key: 'home',
    storage,
    whitelist: ['devices', 'currentDevice', 'currentCpu', 'currentDeviceCpuLink', 'currentGpuLink', 'currentDiskLink', 'currentRamLink'],
};

export const { clearHomeState, clearCurrentDevice, clearCurrentCpu, clearCurrentGpuLink } = homeSlice.actions;
export const homeReducer = persistReducer(persistConfig, homeSlice.reducer);