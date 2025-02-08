import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    mode: localStorage.getItem("theme") || "dark",
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state) => {
            const newTheme = state.mode === 'dark' ? 'light' : 'dark'
            state.mode = newTheme;
            localStorage.setItem("theme", newTheme)
        }
    }
})

export const {changeTheme} = themeSlice.actions;
export const selectTheme = (state: any) => state.theme;
export const themeReducer = themeSlice.reducer;