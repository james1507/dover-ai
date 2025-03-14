import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OurModel {
    title: string;
    artist: string;
    image: string;
}

const albums: OurModel[] = [
    { title: "Background Removal", artist: "Shanchez", image: "https://a.storyblok.com/f/160496/1472x981/9bf40ad4ff/bg-removal-slider-v2artboard-1-copy.png" },
    { title: "Image Upscale", artist: "Dover", image: "https://i.ytimg.com/vi/HR7o8SQlmBk/maxresdefault.jpg" },
    { title: "Face Swap", artist: "James", image: "https://www.vidau.ai/wp-content/uploads/2024/09/unnamed-15.png" },
    { title: "Audio Clean", artist: "Tamkend", image: "https://massive.io/wp-content/uploads/2024/10/AI-audio-cleanup.jpg" },
];

const bgColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];

const OurModelList = () => {
    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Model của chúng tôi</h2>
            </div>

            {/* Grid 2 hàng, 2 cột (desktop) */}
            <div className="grid grid-cols-2 gap-4">
                {albums.map((album, index) => {
                    const bgColor = bgColors[index % bgColors.length];
                    return <OurModelCard key={index} album={album} bgColor={bgColor} />;
                })}
            </div>
        </div>
    );
};

interface OurModelCardProps {
    album: OurModel;
    bgColor: string;
}

const OurModelCard: React.FC<OurModelCardProps> = ({ album, bgColor }) => {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/model-inferencing", { state: { title: album.title, image: album.image } })}
            className="relative w-full group transition-transform duration-300 hover:scale-100 focus:outline-none"
        >
            <div className="relative w-full group transition-transform duration-300 hover:scale-100">
                <div className="relative rounded-md overflow-hidden bg-gray-800 shadow-lg w-full h-44 flex items-center justify-center">
                    {album.image && !imageError ? (
                        <img
                            src={album.image}
                            alt={album.title}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${bgColor}`}>
                            <span className="text-4xl font-bold">{album.title.charAt(0)}</span>
                        </div>
                    )}
                </div>

                {/* Hover nền sáng nhẹ từ dưới lên */}
                <div className="absolute inset-0 rounded-md bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                {/* Tên album & artist */}
                <div className="mt-2 text-center">
                    <p className="font-semibold text-center break-words w-full px-2">
                        {album.title}
                    </p>
                    <p className="text-gray-400 text-sm">{album.artist}</p>
                </div>
            </div>
        </button>
    );
};

export default OurModelList;
