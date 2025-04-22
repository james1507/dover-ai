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

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = "";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request details
        const requestLog = `
🚀 API Request:
URL: ${config.baseURL}${config.url}
Method: ${config.method?.toUpperCase()}
Headers: ${JSON.stringify(config.headers, null, 2)}
Body: ${JSON.stringify(config.data, null, 2)}
        `;
        appService.appLog(requestLog);

        return config;
    },
    (error) => {
        // Log request error
        appService.appLog(`❌ Request Error: ${error.message}`);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Log successful response
        const responseLog = `
✅ API Response Success:
URL: ${response.config.baseURL}${response.config.url}
Status: ${response.status}
StatusText: ${response.statusText}
Data: ${JSON.stringify(response.data, null, 2)}
        `;
        appService.appLog(responseLog);

        return response;
    },
    (error) => {
        // Log error response
        const errorLog = `
❌ API Response Error:
URL: ${error.config.baseURL}${error.config.url}
Status: ${error.response?.status}
StatusText: ${error.response?.statusText}
Error Message: ${error.message}
Response Data: ${JSON.stringify(error.response?.data, null, 2)}
        `;
        appService.appLog(errorLog);

        return Promise.reject(error);
    }
);

export default apiClient;