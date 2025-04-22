import { apiService } from "@core/services/apiService";
import { dockerService } from "@core/services/dockerService";
import { useState } from "react";

const BackgroundRemoveContainer = () => {
    const [loading, setLoading] = useState(false);
    const [containerId, setContainerId] = useState<string | null>(null);
    const [outputPath, setOutputPath] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ message: string; percentage: number } | null>(null);
    const [inputUrl, setInputUrl] = useState<string>("");

    const handleRunContainer = async () => {
        setLoading(true);
        setError(null);
        setOutputPath(null);
        setBase64Image(null);
        setProgress({ message: "Starting...", percentage: 0 });

        try {
            // Bước 1: Chạy container
            const id = await dockerService.pullAndRunImage("jamesdev1507/rmbg-app", (progressUpdate) => {
                setProgress(progressUpdate);
            });
            setContainerId(id);

            // Bước 2: Gọi API removeBg với URL ảnh nhập vào để lấy output_path
            const removeBgResponse = await apiService.removeBackground(inputUrl);
            // Giả sử removeBgResponse.output_path trả về ví dụ: "/app/output.png"

            // Bước 3: Dùng output_path nhận được từ API để gọi copyFromDocker
            const copiedFilePath = await dockerService.copyFromDocker(
                "angry_bell",
                removeBgResponse.output_path
            );
            setOutputPath(copiedFilePath);

            // Bước 4: Đọc file và chuyển thành base64
            const base64Data = await dockerService.readImageFile(copiedFilePath);
            setBase64Image(base64Data);
        } catch (err) {
            setError(`Lỗi: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Chạy Container và Xóa Background</h2>
            <div className="mb-4">
                <label htmlFor="imageUrl" className="block mb-1">
                    Nhập URL ảnh:
                </label>
                <input
                    id="imageUrl"
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
            </div>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                onClick={handleRunContainer}
                disabled={loading}
            >
                {loading ? "Đang chạy..." : "Chạy Container và Xóa Background"}
            </button>

            {/* Progress Bar */}
            {progress && (
                <div className="mt-4">
                    <p className="text-gray-600 mb-2">
                        {progress.message} ({progress.percentage.toFixed(1)}%)
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {containerId && <p className="mt-4 text-green-600">Container ID: {containerId}</p>}
            {outputPath && <p className="mt-4 text-blue-600">File copied: {outputPath}</p>}
            {base64Image && (
                <div className="mt-4">
                    <img src={`data:image/png;base64,${base64Image}`} alt="Output" className="max-w-full h-auto" />
                </div>
            )}
            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default BackgroundRemoveContainer;
