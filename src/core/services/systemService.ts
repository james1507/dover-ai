import { invoke } from "@tauri-apps/api/core";

interface DiskInfo {
  name: string;
  total_space: number;
  available_space: number;
}

interface SystemInfo {
  total_memory: number;
  used_memory: number;
  total_swap: number;
  used_swap: number;
  cpu_usage: number;
  gpu_usage: number | null;
  disk_space: DiskInfo[];
  cpu_name: string;         // Thêm tên CPU
  gpu_name: string | null;  // Thêm tên GPU (nullable)
  system_name: string;      // Thêm tên hệ điều hành
}

class SystemService {
  async getSystemInfo(): Promise<SystemInfo> {
    return await invoke<SystemInfo>('get_system_info');
  }
}

export const systemService = new SystemService();