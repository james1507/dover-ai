import ThemeToggle from "@shared/components/themes/ThemeToggle";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 
                    text-gray-900 dark:text-gray-100 
                    transition-colors duration-200">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">
                    Theme Switcher Demo
                </h1>

                <ThemeToggle />

                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p>This is a sample content with theme support</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;