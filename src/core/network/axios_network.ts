import { API_BASE_URL } from "@core/utils/constants";
import axios from "axios";
import { appService } from "@core/services/appService";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Hàm đăng ký interceptor, truyền store vào
export function setupAxiosInterceptors(store: any) {
    apiClient.interceptors.request.use(
        (config) => {
            try {
                const state = store.getState();
                const accessToken = state.auth?.accessToken;
                if (accessToken) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
            } catch (error) {
                console.error('Error setting auth header:', error);
            }
            // Log request details
            const requestLog = `\n            ➜ API Request:\n            URL: ${config.baseURL}${config.url}\n            Method: ${config.method?.toUpperCase()}\n            Headers: ${JSON.stringify(config.headers, null, 2)}\n            Body: ${JSON.stringify(config.data, null, 2)}\n        `;
            appService.appLog(requestLog);
            return config;
        },
        (error) => {
            appService.appLog(`❌ Request Error: ${error.message}`);
            return Promise.reject(error);
        }
    );
    // Response interceptor giữ nguyên
    apiClient.interceptors.response.use(
        (response) => {
            const responseLog = `\n            🟢 API Response Success:\n            URL: ${response.config.baseURL}${response.config.url}\n            Status: ${response.status}\n            StatusText: ${response.statusText}\n            Data: ${JSON.stringify(response.data, null, 2)}\n        `;
            appService.appLog(responseLog);
            return response;
        },
        (error) => {
            const errorLog = `\n            ✖ API Response Error:\n            URL: ${error.config.baseURL}${error.config.url}\n            Status: ${error.response?.status}\n            StatusText: ${error.response?.statusText}\n            Error Message: ${error.message}\n            Response Data: ${JSON.stringify(error.response?.data, null, 2)}\n        `;
            appService.appLog(errorLog);
            return Promise.reject(error);
        }
    );
}

export default apiClient;