import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@core/store/store";
import { addDevice, addCpu, addGpuAndLink, addDiskAndLink, addRamAndLink } from "@features/Home/store/homeSlice";
import { 
    AddCpuPayload, 
    AddDeviceSuccessResponse, 
    DeviceCpuResponse, 
    AddGpuPayload,
    DeviceGpuResponse,
    AddDiskPayload,
    DeviceDiskResponse,
    AddRamPayload,
    DeviceRamResponse,
} from "@features/Home/types";
import { getSystemInfo } from "@core/services/systemService";

export function useAddDevice() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const loading = useSelector((state: RootState) => state.home.loading);

    const apiCallsInitiated = useRef(false);

    useEffect(() => {
        const addDeviceAndCpuAndGpuAndLink = async () => {
            // Gọi ngầm addDevice khi HomePage mount và có user
            if (user && user.id) {
                try {
                    // Fetch system information
                    const systemInfo = await getSystemInfo();
                    console.log("Fetched system info:", systemInfo);

                    // Dispatch addDevice and await its completion
                    const deviceResult = await dispatch(addDevice({
                        owner_id: user.id,
                        status: "ACTIVE",
                        hourly_rate: 10.5,
                        location: "Server Room A",
                        last_active: "2025-05-24T14:30:00"
                    })).unwrap() as AddDeviceSuccessResponse;

                    // If addDevice was successful and returned nested device data with an id, dispatch the combined addCpu thunk
                    if (deviceResult && deviceResult.data && deviceResult.data.device && deviceResult.data.device.id) {
                        console.log("Device added successfully with ID:", deviceResult.data.device.id);

                        // Dispatch the combined addCpu thunk with CPU payload and device ID, using system info
                        const cpuAndLinkResult = await dispatch(addCpu({
                            cpuPayload: { // Wrap CPU data in cpuPayload
                                // Use systemInfo for available fields, keep placeholders for others
                                model_name: systemInfo?.cpu_name || "Placeholder CPU Model",
                                manufacturer: "Placeholder Manufacturer",
                                architecture: "Placeholder Architecture",
                                cores: 0,
                                threads: 0,
                                base_clock_ghz: 0,
                                boost_clock_ghz: 0,
                                tdp_watts: 0,
                                l1_cache_kb: 0,
                                l2_cache_mb: 0,
                                l3_cache_mb: 0,
                                // integrated_gpu: 0, // Uncomment and provide value if applicable
                                // ---------------------------------------------------------
                            } as AddCpuPayload, // Explicitly cast cpuPayload type
                            deviceId: deviceResult.data.device.id, // Pass the device ID
                        })).unwrap() as DeviceCpuResponse;

                         // The combined CPU thunk returns the link success response or throws an error
                        if (cpuAndLinkResult && cpuAndLinkResult.data && cpuAndLinkResult.data.devicecpu && cpuAndLinkResult.data.devicecpu.id) {
                             console.log("Device and CPU linked successfully with link ID:", cpuAndLinkResult.data.devicecpu.id); // Log success with link ID

                             // Now dispatch the combined addGpuAndLink thunk, using system info for GPU name
                             const gpuAndLinkResult = await dispatch(addGpuAndLink({
                                gpuPayload: { // Wrap GPU data in gpuPayload
                                    // Use systemInfo for available fields, keep placeholders for others
                                    model_name: systemInfo?.gpu_name || "Placeholder GPU Model", // Use gpu_name if available
                                    manufacturer: "Test Manufacturer",
                                    architecture: "NVIDIA Ampere",
                                    vram_mb: 8192,
                                    cuda_cores: 3584,
                                    tensor_cores: 112,
                                    core_clock_mhz: 1500,
                                    boost_clock_mhz: 1800,
                                    memory_clock_mhz: 7000,
                                    memory_type: "GDDR6",
                                    memory_bus_width: 256,
                                    tdp_watts: 220,
                                    directx_support: "12_2",
                                    opengl_support: "4.6",
                                    rt_cores: 28,
                                    metal_support: 0,
                                    vulkan_support: 1
                                    // ---------------------------------------------------------
                                } as AddGpuPayload, // Explicitly cast gpuPayload type
                                deviceId: deviceResult.data.device.id, // Pass the device ID
                             })).unwrap() as DeviceGpuResponse;

                             // The combined GPU thunk returns the link success response or throws an error
                             if (gpuAndLinkResult && gpuAndLinkResult.data && gpuAndLinkResult.data.devicegpu && gpuAndLinkResult.data.devicegpu.id) {
                                console.log("Device and GPU linked successfully with link ID:", gpuAndLinkResult.data.devicegpu.id); // Log success with link ID

                                // Now dispatch the combined addDiskAndLink thunk
                                const diskAndLinkResult = await dispatch(addDiskAndLink({
                                    diskPayload: { // Wrap Disk data in diskPayload
                                        // --- Provided Disk Data ---
                                        model_name: "Test SSD",
                                        manufacturer: "Test Manufacturer",
                                        disk_type: "SSD",
                                        capacity_gb: 1000,
                                        interface: "NVMe",
                                        read_speed_mbps: 3500,
                                        write_speed_mbps: 3000,
                                        rpm: null,
                                        cache_mb: 1024,
                                        endurance_tbw: 600,
                                        lifespan_hours: 1500000,
                                        power_consumption_watts: 6.5
                                        // --------------------------
                                    } as AddDiskPayload, // Explicitly cast diskPayload type
                                    deviceId: deviceResult.data.device.id, // Pass the device ID
                                })).unwrap() as DeviceDiskResponse; // Cast to the correct response type

                                // The combined Disk thunk returns the link success response or throws an error
                                // Access nested data.devicedisk
                                if (diskAndLinkResult && diskAndLinkResult.data && diskAndLinkResult.data.devicedisk && diskAndLinkResult.data.devicedisk.id) { // Corrected access to Disk link ID
                                    console.log("Device and Disk linked successfully with link ID:", diskAndLinkResult.data.devicedisk.id); // Log success with link ID

                                    // Now dispatch the combined addRamAndLink thunk
                                    const ramAndLinkResult = await dispatch(addRamAndLink({
                                        ramPayload: { // Wrap RAM data in ramPayload
                                            // --- Provided RAM Data ---
                                            size_gb: 16,
                                            type: "DDR4",
                                            speed_mhz: 3200,
                                            manufacturer: "Test Manufacturer",
                                            form_factor: "DIMM",
                                            voltage: 1.35,
                                            ecc_support: 0
                                            // --------------------------
                                        } as AddRamPayload, // Explicitly cast ramPayload type
                                        deviceId: deviceResult.data.device.id, // Pass the device ID
                                    })).unwrap() as DeviceRamResponse; // Cast to the correct response type

                                    // The combined RAM thunk returns the link success response or throws an error
                                    // Access nested data.deviceram
                                    if (ramAndLinkResult && ramAndLinkResult.data && ramAndLinkResult.data.deviceram && ramAndLinkResult.data.deviceram.id) { // Corrected access to RAM link ID
                                        console.log("Device and RAM linked successfully with link ID:", ramAndLinkResult.data.deviceram.id); // Log success with link ID
                                    } else {
                                        console.error("Add RAM and link operation did not return nested deviceram data with an ID."); // Log error
                                    }

                                } else {
                                    console.error("Add Disk and link operation did not return nested devicedisk data with an ID."); // Log error
                                }

                             } else {
                                console.error("Add GPU and link operation did not return nested devicegpu data with an ID."); // Log error
                             }

                        } else {
                            console.error("Add CPU and link operation did not return nested devicecpu data with an ID."); // Log error
                        }

                    } else {
                        console.error("Add device was successful but did not return nested device data with an ID."); // Updated log
                    }

                } catch (error) {
                    console.error("Failed during device, CPU, GPU, Disk, or RAM linking operation:", error); // Updated error log
                    // Handle errors if needed
                }
            }
        };

        if (!apiCallsInitiated.current) {
            apiCallsInitiated.current = true;
            addDeviceAndCpuAndGpuAndLink();
        }

    }, [dispatch, user]); // Depend on dispatch and user

    return { loading };
} 