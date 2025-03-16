import { systemService } from "@core/services/systemService";
import { useEffect, useState } from "react";

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
  disk_space: DiskInfo[];
  cpu_name: string;
  gpu_name: string | null;
  system_name: string;
}

const DistributionList = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hàm lấy thông tin hệ thống
    const fetchSystemInfo = async () => {
      try {
        const info = await systemService.getSystemInfo();
        setSystemInfo(info);
      } catch (err) {
        setError("Không thể lấy thông tin hệ thống");
        console.error(err);
      }
    };

    // Gọi lần đầu tiên
    fetchSystemInfo();

    // Thiết lập interval để cập nhật mỗi 1 giây
    const intervalId = setInterval(fetchSystemInfo, 1000);

    // Cleanup interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Cột trái: Thông tin hệ thống */}
      <div className="w-1/3 p-4 bg-gray-100 border-r border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Thông tin hệ thống</h2>
        {error && <p className="text-red-500">{error}</p>}
        {systemInfo ? (
          <div>
            <p><strong>Hệ điều hành:</strong> {systemInfo.system_name}</p>
            <p><strong>Tên CPU:</strong> {systemInfo.cpu_name}</p>
            <p><strong>Tên GPU:</strong> {systemInfo.gpu_name || "Không xác định"}</p>
            <p><strong>RAM Tổng:</strong> {(systemInfo.total_memory / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>RAM Đã dùng:</strong> {(systemInfo.used_memory / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Swap Tổng:</strong> {(systemInfo.total_swap / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Swap Đã dùng:</strong> {(systemInfo.used_swap / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>CPU Usage:</strong> {systemInfo.cpu_usage.toFixed(2)}%</p>
            <h3 className="mt-4 font-semibold">Danh sách ổ đĩa:</h3>
            <ul className="list-disc ml-5">
              {systemInfo.disk_space.map((disk, index) => (
                <li key={index}>
                  {disk.name}: {(disk.available_space / 1024 / 1024 / 1024).toFixed(2)} GB / {(disk.total_space / 1024 / 1024 / 1024).toFixed(2)} GB
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Đang tải thông tin hệ thống...</p>
        )}
      </div>

      {/* Cột phải: Nội dung DistributionList */}
      <div className="w-2/3 p-4">
        <h2 className="text-xl font-semibold mb-4">Danh sách phân phối</h2>
        <p>Thông tin về các mô hình phân phối sẽ hiển thị ở đây...</p>
      </div>
    </div>
  );
};

export default DistributionList;