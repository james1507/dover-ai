import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiAuthService } from '@features/Authentication/services/apiAuthServices';
import { RegisterPayload, UserData, AuthResponse } from '@features/types/types';
import { appService } from '@core/services/appService';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            await appService.appLog('Attempting login...');
            const response = await apiAuthService.login(email, password);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`Login failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Login successful');
            return response;
        } catch (error: any) {
            await appService.appLog(`Login error: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error',
                data: null
            });
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            await appService.appLog('Attempting registration...');
            const response = await apiAuthService.register(payload);
            
            if (response.status !== 'success' || !response.data) {
                await appService.appLog(`Registration failed: ${response.msg}`);
                return rejectWithValue(response);
            }

            await appService.appLog('Registration successful');
            return response;
        } catch (error: any) {
            await appService.appLog(`Registration error: ${error.message}`);
            return rejectWithValue({
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error',
                data: null
            });
        }
    }
);

interface AuthState {
    loading: boolean;
    error: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    user: UserData | null;
}

const initialState: AuthState = {
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
        },
        clearAuthState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.accessToken = action.payload.data.access_token;
                    state.refreshToken = action.payload.data.refresh_token;
                    state.user = action.payload.data.user;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                const errorResponse = action.payload as AuthResponse;
                state.error = errorResponse?.msg || 'Unknown error';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.accessToken = action.payload.data.access_token;
                    state.refreshToken = action.payload.data.refresh_token;
                    state.user = action.payload.data.user;
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                const errorResponse = action.payload as AuthResponse;
                state.error = errorResponse?.msg || 'Unknown error';
            });
    },
});

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['accessToken', 'refreshToken', 'user'],
};

export const { logout, clearAuthState } = authSlice.actions;
export const authReducer = persistReducer(persistConfig, authSlice.reducer);
