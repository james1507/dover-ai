import { AppDispatch, RootState } from '@core/store/store';
import { toggleTheme } from '@core/theme/themeSlice';
import { useDispatch, useSelector } from 'react-redux';

function ThemeToggle() {
    const { theme } = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 
                 text-gray-800 dark:text-gray-200 
                 hover:bg-gray-300 dark:hover:bg-gray-600 
                 transition-colors duration-200"
        >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
    );
}

export default ThemeToggle;