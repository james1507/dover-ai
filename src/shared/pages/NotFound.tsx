import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('pageNotFound')}</h2>
            <Link to="/">{t('returnToHomepage')}</Link>
        </div>
    );
};

export default NotFound;