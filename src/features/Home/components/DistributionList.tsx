import * as systemService from "@core/services/systemService";
import { useEffect, useState } from "react";
import { Cpu, HardDrive, MemoryStick, Monitor, Server } from "lucide-react";

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
    cpu_name: string;
    gpu_name: string | null;
    system_name: string;
}

const DistributionList = () => {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const info = await systemService.getSystemInfo();
                if (info) {
                    setSystemInfo(info);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin hệ thống:", err);
                setError("Không thể lấy thông tin hệ thống");
            }
        };

        fetchSystemInfo();
        const intervalId = setInterval(fetchSystemInfo, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const ProgressBar = ({ used, total }: { used: number; total: number }) => {
        const percentage = (used / total) * 100;
        return (
            <div className="w-full rounded-lg h-4 overflow-hidden border border-gray-300">
                <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        );
    };

    return (
        <div className="flex p-4">
            {/* Cột trái: Thông tin hệ thống */}
            <div className="w-1/4 p-4 shadow-md rounded-md border border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    Thông tin hệ thống
                </h2>
                {error && <p className="text-red-500">{error}</p>}
                {systemInfo ? (
                    <div className="mt-3 space-y-3 text-sm">
                        <p className="flex items-center gap-2">
                            <Server className="w-4 h-4 " />
                            <strong>HĐH:</strong> {systemInfo.system_name}
                        </p>
                        <p className="flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            <strong>CPU:</strong> {systemInfo.cpu_name}
                        </p>
                        <p className="flex items-center gap-2">
                            <MemoryStick className="w-4 h-4" />
                            <strong>GPU:</strong> {systemInfo.gpu_name || "Không xác định"}
                        </p>

                        <div>
                            <p className="font-semibold">RAM</p>
                            <ProgressBar used={systemInfo.used_memory} total={systemInfo.total_memory} />
                            <p className="text-xs">
                                {((systemInfo.used_memory / 1024 / 1024).toFixed(2))} MB /{" "}
                                {((systemInfo.total_memory / 1024 / 1024).toFixed(2))} MB
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Swap</p>
                            <ProgressBar used={systemInfo.used_swap} total={systemInfo.total_swap} />
                            <p className="text-xs">
                                {((systemInfo.used_swap / 1024 / 1024).toFixed(2))} MB /{" "}
                                {((systemInfo.total_swap / 1024 / 1024).toFixed(2))} MB
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">CPU</p>
                            <ProgressBar used={systemInfo.cpu_usage} total={100} />
                            <p className="text-xs">{systemInfo.cpu_usage.toFixed(2)}%</p>
                        </div>

                        {systemInfo.gpu_usage !== null && (
                            <div>
                                <p className="font-semibold">GPU</p>
                                <ProgressBar used={systemInfo.gpu_usage} total={100} />
                                <p className="text-xs">{systemInfo.gpu_usage.toFixed(2)}%</p>
                            </div>
                        )}

                        <div>
                            <h3 className="mt-3 font-semibold flex items-center gap-2">
                                <HardDrive className="w-4 h-4" />
                                Ổ đĩa:
                            </h3>
                            <ul className="mt-1 space-y-1">
                                {systemInfo.disk_space.map((disk, index) => {
                                    const usedSpace = disk.total_space - disk.available_space;
                                    return (
                                        <li key={index} className="border-b pb-1">
                                            <p className="text-xs font-medium">{disk.name}</p>
                                            <ProgressBar used={usedSpace} total={disk.total_space} />
                                            <p className="text-xs">
                                                {(usedSpace / 1024 / 1024 / 1024).toFixed(2)} GB /{" "}
                                                {(disk.total_space / 1024 / 1024 / 1024).toFixed(2)} GB
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <p className="text-sm">Đang tải...</p>
                    </div>
                )}
            </div>

            {/* Cột phải: Nội dung DistributionList */}
            <div className="w-3/4 p-4">
                <h2 className="text-lg font-semibold">Danh sách phân phối</h2>
                <p className="text-gray-600 text-sm">Thông tin về các mô hình phân phối sẽ hiển thị ở đây...</p>
            </div>
        </div>

    );
};

export default DistributionList;
