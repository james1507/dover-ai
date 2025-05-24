import { appService } from '@core/services/appService';
import apiClient from '@core/network/axios_network';
import { BaseApiResponse } from '@shared/types/ApiResponse';
import { AddCpuPayload, DeviceCpuResponse, AddGpuPayload, DeviceGpuResponse as DeviceGpuLinkResponse, AddDiskPayload, DeviceDiskResponse, AddRamPayload, DeviceRamResponse as DeviceRamLinkResponse } from "@features/Home/types";

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

// Removed individual AddCpuPayload, CpuData, CpuResponse, AddDeviceCpuPayload, DeviceCpuData, DeviceCpuResponse interfaces
// They are now imported from types.ts where applicable for the combined function.

class ApiHomeServices {
    async addDevice(payload: AddDevicePayload): Promise<DeviceResponse> {
        try {
            // Đã sửa endpoint từ /adddevice sang /devices/ như yêu cầu trước
            const response = await apiClient.post<DeviceResponse>('/devices/', payload);
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

    // Combined method to add CPU and link it to a device
    async deviceCpu(
        cpuPayload: AddCpuPayload,
        deviceId: number
    ): Promise<DeviceCpuResponse | BaseApiResponse> { // Return type can be success (DeviceCpuResponse) or error (BaseApiResponse)
        try {
            // 1. Call addCpu internally
            await appService.appLog('Attempting to add CPU...');
            // Need a local interface for CpuResponse if not importing it
            // Or we can rely on the structure and check data and data.cpu.id
            const cpuResponse = await apiClient.post('/cpus/', cpuPayload);

            // Check if the response and nested data are as expected
            if (cpuResponse.status !== 200 || !cpuResponse.data || !cpuResponse.data.data || !cpuResponse.data.data.cpu || !cpuResponse.data.data.cpu.id) {
                 await appService.appLog(`Add CPU failed or returned unexpected data structure: ${cpuResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: cpuResponse.data?.status || 'error',
                    code: cpuResponse.status || 500,
                    msg: cpuResponse.data?.msg || 'Add CPU failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('CPU added successfully');
            const cpuId = cpuResponse.data.data.cpu.id; // Correctly access the nested cpu id

            // 2. Call linkDeviceCpu internally
            await appService.appLog('Attempting to link Device and CPU...');
            const linkResponse = await apiClient.post('/devicecpus/', { device_id: deviceId, cpu_id: cpuId });

             // Check if the response and nested data are as expected for linking
             if (linkResponse.status !== 200 || !linkResponse.data || !linkResponse.data.data || !linkResponse.data.data.devicecpu || !linkResponse.data.data.devicecpu.id) {
                await appService.appLog(`Link Device and CPU failed or returned unexpected data structure: ${linkResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: linkResponse.data?.status || 'error',
                    code: linkResponse.status || 500,
                    msg: linkResponse.data?.msg || 'Link Device and CPU failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('Device and CPU linked successfully');
            // Return the successful link response, cast to the expected type
            return linkResponse.data as DeviceCpuResponse;

        } catch (error: any) {
            // Handle network errors or other unexpected errors
            await appService.appLog(`DeviceCpu operation error: ${error.message}`);
             if (error.response?.data) {
                return error.response.data as BaseApiResponse; // Return server error response if available
            }
            return {
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error during DeviceCpu operation',
                data: null
            };
        }
    }
    // Removed individual addCpu and linkDeviceCpu methods

    // Combined method to add GPU and link it to a device
    async deviceGpu(
        gpuPayload: AddGpuPayload,
        deviceId: number
    ): Promise<DeviceGpuLinkResponse | BaseApiResponse> { // Return type can be success (DeviceGpuLinkResponse) or error (BaseApiResponse)
        try {
            // 1. Call addGpu internally
            await appService.appLog('Attempting to add GPU...');
            // Need a local interface for GpuResponse if not importing it
            const gpuResponse = await apiClient.post('/gpus/', gpuPayload);

            // Check if the response and nested data are as expected based on user-provided response structure
            if (gpuResponse.status !== 200 || !gpuResponse.data || !gpuResponse.data.data || !gpuResponse.data.data.gpu || !gpuResponse.data.data.gpu.id) {
                 await appService.appLog(`Add GPU failed or returned unexpected data structure: ${gpuResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: gpuResponse.data?.status || 'error',
                    code: gpuResponse.status || 500,
                    msg: gpuResponse.data?.msg || 'Add GPU failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('GPU added successfully');
            const gpuId = gpuResponse.data.data.gpu.id; // Correctly access the nested gpu id

            // 2. Call linkDeviceGpu internally
            await appService.appLog('Attempting to link Device and GPU...');
            const linkResponse = await apiClient.post('/devicegpus/', { device_id: deviceId, gpu_id: gpuId });

             // Check if the response and nested data are as expected for linking based on user-provided response structure
             if (linkResponse.status !== 200 || !linkResponse.data || !linkResponse.data.data || !linkResponse.data.data.devicegpu || !linkResponse.data.data.devicegpu.id) {
                await appService.appLog(`Link Device and GPU failed or returned unexpected data structure: ${linkResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: linkResponse.data?.status || 'error',
                    code: linkResponse.status || 500,
                    msg: linkResponse.data?.msg || 'Link Device and GPU failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('Device and GPU linked successfully');
            // Return the successful link response, cast to the expected type
            return linkResponse.data as DeviceGpuLinkResponse; // Use the aliased type

        } catch (error: any) {
            // Handle network errors or other unexpected errors
            await appService.appLog(`DeviceGpu operation error: ${error.message}`);
             if (error.response?.data) {
                return error.response.data as BaseApiResponse; // Return server error response if available
            }
            return {
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error during DeviceGpu operation',
                data: null
            };
        }
    }
    // Removed individual addGpu and linkDeviceGpu methods

    // Combined method to add Disk and link it to a device
    async deviceDisk(
        diskPayload: AddDiskPayload,
        deviceId: number
    ): Promise<DeviceDiskResponse | BaseApiResponse> { // Return type can be success (DeviceDiskResponse) or error (BaseApiResponse)
        try {
            // 1. Call addDisk internally
            await appService.appLog('Attempting to add Disk...');
            // Need a local interface for DiskResponse if not importing it
            const diskResponse = await apiClient.post('/disks/', diskPayload);

            // Check if the response and nested data are as expected based on user-provided response structure
            if (diskResponse.status !== 200 || !diskResponse.data || !diskResponse.data.data || !diskResponse.data.data.disk || !diskResponse.data.data.disk.id) {
                 await appService.appLog(`Add Disk failed or returned unexpected data structure: ${diskResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: diskResponse.data?.status || 'error',
                    code: diskResponse.status || 500,
                    msg: diskResponse.data?.msg || 'Add Disk failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('Disk added successfully');
            const diskId = diskResponse.data.data.disk.id; // Correctly access the nested disk id

            // 2. Call linkDeviceDisk internally
            await appService.appLog('Attempting to link Device and Disk...');
            const linkResponse = await apiClient.post('/devicedisks/', { device_id: deviceId, disk_id: diskId });

             // Check if the response and nested data are as expected for linking based on user-provided response structure
             if (linkResponse.status !== 200 || !linkResponse.data || !linkResponse.data.data || !linkResponse.data.data.devicedisk || !linkResponse.data.data.devicedisk.id) {
                await appService.appLog(`Link Device and Disk failed or returned unexpected data structure: ${linkResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: linkResponse.data?.status || 'error',
                    code: linkResponse.status || 500,
                    msg: linkResponse.data?.msg || 'Link Device and Disk failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('Device and Disk linked successfully');
            // Return the successful link response, cast to the expected type
            return linkResponse.data as DeviceDiskResponse; // Use the correct response type

        } catch (error: any) {
            // Handle network errors or other unexpected errors
            await appService.appLog(`DeviceDisk operation error: ${error.message}`);
             if (error.response?.data) {
                return error.response.data as BaseApiResponse; // Return server error response if available
            }
            return {
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error during DeviceDisk operation',
                data: null
            };
        }
    }
    // -------------------

    // Combined method to add RAM and link it to a device
    async deviceRam(
        ramPayload: AddRamPayload,
        deviceId: number
    ): Promise<DeviceRamLinkResponse | BaseApiResponse> { // Use aliased type for link response
        try {
            // 1. Call addRam internally
            await appService.appLog('Attempting to add RAM...');
            const ramResponse = await apiClient.post('/rams/', ramPayload);

            // Check if the response and nested data are as expected based on user-provided response structure
            if (ramResponse.status !== 200 || !ramResponse.data || !ramResponse.data.data || !ramResponse.data.data.ram || !ramResponse.data.data.ram.id) {
                 await appService.appLog(`Add RAM failed or returned unexpected data structure: ${ramResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: ramResponse.data?.status || 'error',
                    code: ramResponse.status || 500,
                    msg: ramResponse.data?.msg || 'Add RAM failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('RAM added successfully');
            const ramId = ramResponse.data.data.ram.id; // Correctly access the nested ram id

            // 2. Call linkDeviceRam internally
            await appService.appLog('Attempting to link Device and RAM...');
            const linkResponse = await apiClient.post('/devicerams/', { device_id: deviceId, ram_id: ramId });

             // Check if the response and nested data are as expected for linking based on user-provided response structure
             if (linkResponse.status !== 200 || !linkResponse.data || !linkResponse.data.data || !linkResponse.data.data.deviceram || !linkResponse.data.data.deviceram.id) {
                await appService.appLog(`Link Device and RAM failed or returned unexpected data structure: ${linkResponse.data?.msg || 'Unknown error'}`);
                 // Return an error response based on the structure observed in logs
                 return {
                    status: linkResponse.data?.status || 'error',
                    code: linkResponse.status || 500,
                    msg: linkResponse.data?.msg || 'Link Device and RAM failed or returned unexpected data structure',
                    data: null
                } as BaseApiResponse;
            }

            await appService.appLog('Device and RAM linked successfully');
            // Return the successful link response, cast to the expected type
            return linkResponse.data as DeviceRamLinkResponse; // Use the aliased type

        } catch (error: any) {
            // Handle network errors or other unexpected errors
            await appService.appLog(`DeviceRam operation error: ${error.message}`);
             if (error.response?.data) {
                return error.response.data as BaseApiResponse; // Return server error response if available
            }
            return {
                status: 'error',
                code: 500,
                msg: error.message || 'Unknown error during DeviceRam operation',
                data: null
            };
        }
    }
    // -------------------
}

export const apiHomeService = new ApiHomeServices();