import { useState, useEffect, useRef } from "react";
import HomeTopBar from "@features/Home/components/HomeTopBar";
import ModelList from "../components/ModelList";
import DistributionList from "../components/DistributionList";

const HomePage: React.FC = () => {
    const [hasShadow, setHasShadow] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("model");

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
