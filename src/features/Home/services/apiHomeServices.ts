import { appService } from '@core/services/appService';
import apiClient from '@core/network/axios_network';
import { BaseApiResponse } from '@shared/types/ApiResponse';

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

interface DeviceResponse extends BaseApiResponse {
    data: DeviceData | null;
}

class ApiHomeServices {
    async addDevice(payload: AddDevicePayload): Promise<DeviceResponse> {
        try {
            const response = await apiClient.post<DeviceResponse>('/adddevice', payload);
            return response.data;
        } catch (error: any) {
            // Nếu có response data (response lỗi từ server)
            if (error.response?.data) {
                return error.response.data;
            }
            // Nếu là lỗi network hoặc lỗi khác
            return {
                status: "error",
                code: 500,
                msg: error.message || 'Network Error',
                data: null
            };
        }
    }
}

export const apiHomeService = new ApiHomeServices();