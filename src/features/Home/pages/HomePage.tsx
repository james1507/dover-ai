import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <h1>{t("home")}</h1>
    );
};

export default HomePage;