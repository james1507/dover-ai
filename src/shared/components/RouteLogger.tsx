import { appService } from "@core/services/appService";
import { clearAuthState } from "@features/Authentication/store/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const RouteLogger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        appService.appLog(`Current route: ${location.pathname}`);
        console.log(`Current route: ${location.pathname}`);
        dispatch(clearAuthState());
    }, [location, dispatch]);

    return <>{children}</>;
};

export default RouteLogger;