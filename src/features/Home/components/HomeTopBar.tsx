import { useState } from "react";
import ThemeToggle from "@shared/components/themes/ThemeToggle";
import reactLogo from '@assets/react.svg';
import avatar from '@assets/avatar.jpg';
import { useTranslation } from "react-i18next";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";

interface HomeTopBarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const HomeTopBar: React.FC<HomeTopBarProps> = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full px-4 py-3 flex justify-between items-center bg-white text-black dark:bg-[#121212] dark:text-white">
            <div className="flex items-center gap-2">
                <img src={reactLogo} alt="Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold">{t('doverAI')}</span>
                {/* Chip Buttons */}
                <button
                    className={`px-3 py-1 ml-2 rounded-full text-sm font-medium transition-all ${activeTab === 'model' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => setActiveTab('model')}
                >
                    Model
                </button>
                <button
                    className={`px-3 py-1 ml-2 rounded-full text-sm font-medium transition-all ${activeTab === 'distribution' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onClick={() => setActiveTab('distribution')}
                >
                    Phân phối
                </button>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 p-2 rounded-full hover-effect transition"
                    >
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                        />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50 bg-white dark:bg-[#282828]">
                            <button className="w-full flex items-center px-4 py-2 hover-effect">
                                <User className="w-5 h-5 mr-2" />{t('account')}
                            </button>
                            <button className="w-full flex items-center px-4 py-2 hover-effect">
                                <Settings className="w-5 h-5 mr-2" />{t('profile')}
                            </button>
                            <button className="w-full flex items-center px-4 py-2 hover-effect">
                                <HelpCircle className="w-5 h-5 mr-2" />{t('support')}
                            </button>
                            <button className="w-full flex items-center px-4 py-2 text-red-500 hover-effect">
                                <LogOut className="w-5 h-5 mr-2" />{t('logout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomeTopBar;
