import { AppDispatch, RootState } from '@core/store/store';
import { setTheme } from '@core/theme/themeSlice';
import { useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ThemeProviderProps {
    children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
    const { theme } = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            dispatch(setTheme(savedTheme));
        }
    }, [dispatch]);

    return <>{children}</>;
}

export default ThemeProvider;