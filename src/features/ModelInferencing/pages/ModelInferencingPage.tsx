import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackgroundRemoveContainer from "../components/BackgroundRemoveContainer";


const ModelInferencingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { title, image } = location.state || {}; // Nhận dữ liệu từ state
    const [showBackgroundRemove, setShowBackgroundRemove] = useState(false);

    // Các đoạn mô tả ngẫu nhiên về model
    const descriptions = [
        "Công nghệ AI tiên tiến giúp bạn tạo ra kết quả tuyệt vời chỉ trong vài giây.",
        "Với thuật toán mạnh mẽ, model này cung cấp độ chính xác cao và hiệu suất vượt trội.",
        "Khám phá cách AI có thể giúp bạn tối ưu hóa công việc với tốc độ và chất lượng vượt trội.",
        "Sử dụng model này để cải thiện hình ảnh, âm thanh và video với công nghệ mới nhất."
    ];

    // Chọn một đoạn mô tả ngẫu nhiên
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    return (
        <div className="p-4 ml-2 mr-2">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">{title || "Model Inferencing Page"}</h1>
            </div>

            {/* Hiển thị ảnh nếu có */}
            {image && !showBackgroundRemove && (
                <div className="mt-4 w-full">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-[300px] object-cover rounded-lg shadow-md"
                    />
                </div>
            )}

            {/* Nếu chưa nhấn "Thử Ngay", hiển thị nút và mô tả */}
            {!showBackgroundRemove ? (
                <>
                    <div className="mt-4">
                        <button
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                            onClick={() => setShowBackgroundRemove(true)}
                        >
                            Thử Ngay
                        </button>
                    </div>
                    <div className="mt-4 text-lg">{randomDescription}</div>
                </>
            ) : (
                <BackgroundRemoveContainer />
            )}
        </div>
    );
};

export default ModelInferencingPage;
