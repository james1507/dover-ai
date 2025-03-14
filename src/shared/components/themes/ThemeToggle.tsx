import { AppDispatch, RootState } from '@core/store/store';
import { toggleTheme } from '@core/theme/themeSlice';
import { cn } from '@core/utils/utils';
import { Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function ThemeToggle() {
    const { theme } = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch<AppDispatch>();

    const baseStyles = "flex items-center justify-center rounded-lg transition-colors focus:outline-none";
    const variantsGhost = "hover-effect";
    const sizeIcon = "p-2 w-10 h-10";
    return (
        <button onClick={() => dispatch(toggleTheme())} className={cn(baseStyles, variantsGhost, sizeIcon)}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}

export default ThemeToggle;
