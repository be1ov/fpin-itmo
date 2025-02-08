import {configureStore, ThunkAction, UnknownAction} from '@reduxjs/toolkit';
import {authReducer} from "./slices/AuthSlice.ts";
import {themeReducer} from "./slices/ThemeSlice.ts";
import {educationReducer} from "./slices/EducationSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        education: educationReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  UnknownAction
>;