import { invoke } from '@tauri-apps/api/core';
import { debounce } from 'lodash';

interface SystemInfo {
    total_memory: number;
    used_memory: number;
    total_swap: number;
    used_swap: number;
    cpu_usage: number;
    gpu_usage: number | null;
    disk_space: {
        name: string;
        total_space: number;
        available_space: number;
    }[];
    cpu_name: string;         // Thêm tên CPU
    gpu_name: string | null;  // Thêm tên GPU (nullable)
    system_name: string;      // Thêm tên hệ điều hành
}

// Cache system info
let cachedSystemInfo: SystemInfo | null = null;
const CACHE_DURATION = 1000; // 1 second cache
let lastFetchTime = 0;

// Debounced version of getSystemInfo
const debouncedGetSystemInfo = debounce(async () => {
    const currentTime = Date.now();
    
    // Return cached data if it's still valid
    if (cachedSystemInfo && currentTime - lastFetchTime < CACHE_DURATION) {
        return cachedSystemInfo;
    }

    try {
        const info = await invoke<SystemInfo>('get_system_info');
        cachedSystemInfo = info;
        lastFetchTime = currentTime;
        return info;
    } catch (error) {
        console.error('Error fetching system info:', error);
        throw error;
    }
}, 200); // Debounce threshold of 200ms

export const getSystemInfo = () => debouncedGetSystemInfo();