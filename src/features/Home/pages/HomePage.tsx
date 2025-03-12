import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <h1 className="text-xl font-bold underline">
            {t('home')}
        </h1>
    );
};

export default HomePage;