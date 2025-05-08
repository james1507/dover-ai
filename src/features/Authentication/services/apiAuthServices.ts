import apiClient from '@core/network/axios_network';
import { RegisterPayload, AuthResponse } from '@features/types/types';

class ApiAuthServices {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/login', {
                email,
                password
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data;
            }
            return {
                status: "error",
                code: 500,
                msg: error.message || 'Network Error',
                data: null
            };
        }
    }

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        try {
            payload.role = "user";
            payload.balance = 0;

            const response = await apiClient.post<AuthResponse>('/signup', payload);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data;
            }
            return {
                status: "error",
                code: 500,
                msg: error.message || 'Network Error',
                data: null
            };
        }
    }
}

export const apiAuthService = new ApiAuthServices();
