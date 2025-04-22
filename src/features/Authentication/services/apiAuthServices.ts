import { appService } from '@core/services/appService';
import apiClient from '@core/network/axios_network';
import { RegisterPayload, AuthResponse } from '@features/types/types';

class ApiAuthServices {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/login', {
                email,
                password
            });
            
            // appService.appLog(`API response: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error: any) {
            // Nếu có response data (response lỗi từ server)
            if (error.response?.data) {
                // appService.appLog(`API response: ${JSON.stringify(error.response.data)}`);
                return error.response.data;
            }
            // Nếu là lỗi network hoặc lỗi khác
            // appService.appLog(`API error: ${error.message}`);
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
            payload.role = "user"; // Set default role to "user"
            payload.balance = 0; // Set default balance to 0

            const response = await apiClient.post<AuthResponse>('/signup', payload);
            
            // appService.appLog(`API response: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error: any) {
            // Nếu có response data (response lỗi từ server)
            if (error.response?.data) {
                // appService.appLog(`API eror response: ${JSON.stringify(error.response)}`);
                return error.response.data;
            }
            // Nếu là lỗi network hoặc lỗi khác
            // appService.appLog(`API error: ${error.message}`);
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
