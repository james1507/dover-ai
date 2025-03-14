import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ModelInfer {
    title: string;
    artist: string;
    image: string;
}

const albums: ModelInfer[] = [
    { title: "Speech To Text", artist: "Shanchez", image: "https://cmcts.com.vn/media/data/users/SEO_phase_2/SEOMD/speech-to-text_%281%29.jpg" },
    { title: "Text To Speech", artist: "Dover", image: "https://asia-1-fileserver-2.stringee.com/0/asia-1_1_5VZ52RKUPI06OGI/1691653065-184EE482-C9B1-4A63-87DE-0C1ABEEC65F1.jpeg" },
    { title: "Stable Diffusion", artist: "James", image: "https://www.wepc.com/wp-content/uploads/2023/06/How-to-install-Stable-Diffusion.png" },
    { title: "Spelling", artist: "Tamkend", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbvIZKSA8c9M-4Q2lk6OGvjh6XAafSURX68A&s" },
    { title: "Background Remove", artist: "Nathand", image: "https://js.pngtree.com/astro_images/bg-remover/ai-background-remover.png" },
    { title: "Lammand", artist: "Phias", image: "https://photo2.tinhte.vn/data/attachment-files/2024/09/8465306_cover-meta-llama3.2.jpg" },
    { title: "Lammand 2", artist: "Unknown", image: "https://photo2.tinhte.vn/data/attachment-files/2024/09/8465306_cover-meta-llama3.2.jpg" },
];

const bgColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];

interface PopularModelListProps {
    headerModel: string;
}

const PopularModelList: React.FC<PopularModelListProps> = ({ headerModel }) => {
    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{headerModel}</h2>
                <button className="text-sm text-gray-400 hover:text-white transition">Xem thêm →</button>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {albums.map((album, index) => {
                    const bgColor = bgColors[index % bgColors.length];
                    return <ModelInferCard key={index} album={album} bgColor={bgColor} />;
                })}
            </div>
        </div>
    );
};

interface ModelInferCardProps {
    album: ModelInfer;
    bgColor: string;
}

const ModelInferCard: React.FC<ModelInferCardProps> = ({ album, bgColor }) => {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/model-inferencing")}
            className="relative w-full group transition-transform duration-300 hover:scale-100 focus:outline-none"
        >
            <div className="relative w-full group transition-transform duration-300 hover:scale-105">
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

                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300">
                        <button className="px-3 py-1 bg-white text-gray-900 font-semibold rounded-md shadow-md text-sm">
                            Thử Model Ngay
                        </button>
                    </div>
                </div>

                <div className="absolute inset-0 rounded-md bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

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

export default PopularModelList;
