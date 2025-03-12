import { RootState } from '@core/store/store';
import { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';


interface ThemeProviderProps {
    children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
    const theme = useSelector((state: RootState) => state.theme.theme)

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return <>{children}</>;
}

export default ThemeProvider;