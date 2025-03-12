import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import themeReducer from '@core/theme/themeSlice';

export const store = configureStore({
    reducer: {
        // Thêm API slice vào reducer
        theme: themeReducer,
    },
});


setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;