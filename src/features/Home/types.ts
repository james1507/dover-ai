export interface AddDevicePayload {
    owner_id: number;
    status: string;
    hourly_rate: number;
    location: string;
    last_active: string;
}

export interface DeviceData {
    id: number;
    owner_id: number;
    status: string;
    hourly_rate: number;
    location: string;
    last_active: string;
}

// --- New types for CPU and DeviceCPU (copied from service) ---
export interface AddCpuPayload {
    model_name: string;
    manufacturer: string;
    architecture: string;
    cores: number;
    threads: number;
    base_clock_ghz: number;
    boost_clock_ghz: number;
    tdp_watts: number;
    l1_cache_kb: number;
    l2_cache_mb: number;
    l3_cache_mb: number;
    integrated_gpu?: number;
}

export interface CpuData {
    id: number;
    model_name: string;
    manufacturer: string;
    architecture: string;
    cores: number;
    threads: number;
    base_clock_ghz: number;
    boost_clock_ghz: number;
    tdp_watts: number;
    l1_cache_kb: number;
    l2_cache_mb: number;
    l3_cache_mb: number;
    integrated_gpu?: number;
}

export interface AddDeviceCpuPayload {
    cpu_id: number;
    device_id: number;
    description?: string;
}

export interface DeviceCpuData {
    id: number;
    cpu_id: number;
    device_id: number;
    description?: string;
}
// ------------------------------------------------------------

// Combine payloads for the new orchestrating thunk
export interface AddDeviceAndCpuPayload extends AddDevicePayload, AddCpuPayload {}

import { BaseApiResponse } from "@shared/types/ApiResponse";

export interface DeviceCpuResponse extends BaseApiResponse {
    data: { devicecpu: DeviceCpuData } | null;
}

// --- New types for GPU and DeviceGPU Link ---
export interface AddGpuPayload {
    model_name: string;
    manufacturer: string;
    architecture: string;
    vram_mb: number;
    cuda_cores: number;
    tensor_cores: number;
    core_clock_mhz: number;
    boost_clock_mhz: number;
    memory_clock_mhz: number;
    memory_type: string;
    memory_bus_width: number;
    tdp_watts: number;
    directx_support: string;
    opengl_support: string;
    rt_cores: number;
    metal_support: number;
    vulkan_support: number;
}

export interface GpuData {
    id: number;
    created_at: string;
    directx_support: string;
    model_name: string;
    core_clock_mhz: number;
    opengl_support: string;
    boost_clock_mhz: number;
    rt_cores: number;
    manufacturer: string;
    memory_clock_mhz: number;
    metal_support: number;
    architecture: string;
    memory_type: string;
    vulkan_support: number;
    vram_mb: number;
    memory_bus_width: number;
    cuda_cores: number;
    tdp_watts: number;
    tensor_cores: number;
}

export interface GpuResponse extends BaseApiResponse {
    data: GpuData | null;
}

export interface AddDeviceGpuPayload {
    gpu_id: number;
    device_id: number;
    description?: string;
}

export interface DeviceGpuData {
    id: number;
    description: string | null;
    gpu_id: number;
    device_id: number;
}

export interface DeviceGpuResponse extends BaseApiResponse {
    data: { devicegpu: DeviceGpuData } | null;
}

// Response data structure for nested GPU and DeviceGPU
export interface AddGpuSuccessResponseData {
    gpu: GpuData; // The GPU data is nested under a 'gpu' key
}

export interface AddGpuSuccessResponse extends BaseApiResponse {
     data: AddGpuSuccessResponseData | null; // Data contains the nested gpu object
}

export interface AddDeviceGpuSuccessResponseData {
    devicegpu: DeviceGpuData; // The DeviceGPU data is nested under a 'devicegpu' key
}

export interface AddDeviceGpuSuccessResponse extends BaseApiResponse {
    data: AddDeviceGpuSuccessResponseData | null; // Data contains the nested devicegpu object
}

// Combine payloads for the new orchestrating thunk for GPU
export interface AddGpuAndLinkPayload {
    gpuPayload: AddGpuPayload;
    deviceId: number;
}

// Define a type for the expected successful addDevice response data structure
export interface AddDeviceSuccessResponseData {
    device: DeviceData; // The device data is nested under a 'device' key
}

// Define a type for the full successful addDevice response
export interface AddDeviceSuccessResponse extends BaseApiResponse {
    data: AddDeviceSuccessResponseData | null; // Data contains the nested device object
}

// Define a type for the expected successful addCpu response data structure
export interface AddCpuSuccessResponseData {
    cpu: CpuData; // The CPU data is nested under a 'cpu' key
}

// Define a type for the full successful addCpu response
export interface AddCpuSuccessResponse extends BaseApiResponse {
    status: string;
    code: number;
    msg: string;
    data: AddCpuSuccessResponseData | null; // Data contains the nested cpu object
}

// --- New types for Disk and DeviceDisk Link ---
export interface AddDiskPayload {
    model_name: string;
    manufacturer: string;
    disk_type: string;
    capacity_gb: number;
    interface: string;
    read_speed_mbps: number;
    write_speed_mbps: number;
    rpm: number | null; // Based on provided data (null)
    cache_mb: number | null; // Assuming cache_mb can be null based on data
    endurance_tbw: number | null; // Assuming endurance_tbw can be null
    lifespan_hours: number | null; // Assuming lifespan_hours can be null
    power_consumption_watts: number | null; // Assuming power_consumption_watts can be null
}

export interface DiskData {
    id: number;
    created_at: string;
    model_name: string;
    manufacturer: string;
    capacity_gb: number;
    disk_type: string;
    interface: string;
    read_speed_mbps: number;
    write_speed_mbps: number;
    rpm: number | null;
    cache_mb: number | null;
    endurance_tbw: number | null;
    lifespan_hours: number | null;
    power_consumption_watts: number | null;
}

export interface DiskResponse extends BaseApiResponse {
    data: DiskData | null;
}

export interface AddDeviceDiskPayload {
    disk_id: number;
    device_id: number;
    description?: string;
}

export interface DeviceDiskData {
    id: number;
    description: string | null;
    disk_id: number;
    device_id: number;
}

export interface DeviceDiskResponse extends BaseApiResponse {
    data: { devicedisk: DeviceDiskData } | null; // Corrected to reflect nested structure
}

// Response data structure for nested Disk and DeviceDisk
export interface AddDiskSuccessResponseData {
    disk: DiskData; // The Disk data is nested under a 'disk' key
}

export interface AddDiskSuccessResponse extends BaseApiResponse {
     data: AddDiskSuccessResponseData | null; // Data contains the nested disk object
}

export interface AddDeviceDiskSuccessResponseData {
    devicedisk: DeviceDiskData; // The DeviceDisk data is nested under a 'devicedisk' key
}

export interface AddDeviceDiskSuccessResponse extends BaseApiResponse {
    data: AddDeviceDiskSuccessResponseData | null; // Data contains the nested devicedisk object
}

// Combine payloads for the new orchestrating thunk for Disk
export interface AddDiskAndLinkPayload {
    diskPayload: AddDiskPayload;
    deviceId: number;
}

// --- New types for RAM and DeviceRAM Link ---
export interface AddRamPayload {
    size_gb: number;
    type: string;
    speed_mhz: number;
    manufacturer: string;
    form_factor: string;
    voltage: number;
    ecc_support: number; // assuming 0 or 1 based on data
}

export interface RamData {
    id: number;
    created_at: string;
    size_gb: number;
    type: string;
    speed_mhz: number;
    manufacturer: string;
    form_factor: string;
    voltage: number;
    ecc_support: number;
}

export interface RamResponse extends BaseApiResponse {
    data: RamData | null;
}

export interface AddDeviceRamPayload {
    ram_id: number;
    device_id: number;
    description?: string;
}

export interface DeviceRamData {
    id: number;
    description: string | null;
    device_id: number;
    ram_id: number;
}

export interface DeviceRamResponse extends BaseApiResponse {
    data: { deviceram: DeviceRamData } | null; // Corrected to reflect nested structure
}

// Response data structure for nested RAM and DeviceRAM
export interface AddRamSuccessResponseData {
    ram: RamData; // The RAM data is nested under a 'ram' key
}

export interface AddRamSuccessResponse extends BaseApiResponse {
     data: AddRamSuccessResponseData | null; // Data contains the nested ram object
}

export interface AddDeviceRamSuccessResponseData {
    deviceram: DeviceRamData; // The DeviceRAM data is nested under a 'deviceram' key
}

export interface AddDeviceRamSuccessResponse extends BaseApiResponse {
    data: AddDeviceRamSuccessResponseData | null; // Data contains the nested deviceram object
}

// Combine payloads for the new orchestrating thunk for RAM
export interface AddRamAndLinkPayload {
    ramPayload: AddRamPayload;
    deviceId: number;
}

// Define a type for the expected successful addDevice response data structure
export interface AddDeviceSuccessResponseData {
    device: DeviceData; // The device data is nested under a 'device' key
}

// Define a type for the full successful addDevice response
export interface AddDeviceSuccessResponse extends BaseApiResponse {
    data: AddDeviceSuccessResponseData | null; // Data contains the nested device object
}

// Define a type for the expected successful addCpu response data structure
export interface AddCpuSuccessResponseData {
    cpu: CpuData; // The CPU data is nested under a 'cpu' key
}

// Define a type for the full successful addCpu response
export interface AddCpuSuccessResponse extends BaseApiResponse {
    status: string;
    code: number;
    msg: string;
    data: AddCpuSuccessResponseData | null; // Data contains the nested cpu object
} 