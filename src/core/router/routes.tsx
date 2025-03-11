import HomePage from "@features/Home/pages/HomePage";
import NotFound from "@shared/pages/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;