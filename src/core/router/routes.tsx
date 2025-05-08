import React from "react";
import { BrowserRouter, Route, Routes, Navigate, RouteObject } from "react-router-dom";
import {  useSelector } from "react-redux";
import HomePage from "@features/Home/pages/HomePage";
import ModelInferencingPage from "@features/ModelInferencing/pages/ModelInferencingPage";
import NotFound from "@shared/pages/NotFound";
import LoginPage from "@features/Authentication/pages/LoginPage";
import RegisterPage from "@features/Authentication/pages/RegisterPage";
import { RootState } from "@core/store/store";
import RouteLogger from "@shared/components/RouteLogger";


const authenticatedRoutes: RouteObject[] = [
    { path: "/", element: <HomePage /> },
    { path: "/model-inferencing", element: <ModelInferencingPage /> },
    { path: "/login", element: <Navigate to="/" /> },
    { path: "/register", element: <Navigate to="/" /> },
    { path: "*", element: <NotFound /> }
];

const unauthenticatedRoutes: RouteObject[] = [
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "*", element: <Navigate to="/login" /> }
];

const AppRoutes: React.FC = () => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const currentRoutes = accessToken ? authenticatedRoutes : unauthenticatedRoutes;

    return (
        <BrowserRouter>
            <RouteLogger>
                
                <Routes>
                    {currentRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                </Routes>
            </RouteLogger>
        </BrowserRouter>
    );
};

export default AppRoutes;