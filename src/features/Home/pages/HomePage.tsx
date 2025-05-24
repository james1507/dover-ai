import { useState, useEffect, useRef } from "react";
import HomeTopBar from "@features/Home/components/HomeTopBar";
import ModelList from "../components/ModelList";
import DistributionList from "../components/DistributionList";
import { useAddDevice } from "../hooks/useAddDevice";

const HomePage: React.FC = () => {
    const [hasShadow, setHasShadow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("model");
    const { loading } = useAddDevice();

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setHasShadow(scrollContainerRef.current.scrollTop > 0);
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-4 text-lg">Đang thêm thiết bị...</span>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col text-gray-700 dark:text-gray-100 transition-colors duration-200">
            <div
                className={`sticky top-0 z-10 bg-gray-900 transition-shadow duration-300 ${hasShadow ? "shadow-lg shadow-white/2" : "shadow-none"
                    }`}
            >
                <HomeTopBar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === "model" ? <ModelList /> : <DistributionList />}
            </div>
        </div>
    );
};

export default HomePage;
