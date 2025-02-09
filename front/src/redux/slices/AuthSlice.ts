import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../interfaces/User.interface.ts";

interface AuthState {
    access_token: string | null;
    refresh_token: string | null;
    user: User | null;
    status: "idle" | "loading";
}

const initialState: AuthState = {
    access_token: localStorage.getItem("access_token") || null,
    refresh_token: localStorage.getItem("refresh_token") || null,
    user: null,
    status: "loading",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.user = action.payload.user;
            localStorage.setItem("access_token", action.payload.access_token);
            localStorage.setItem("refresh_token", action.payload.refresh_token);
            state.status = "idle";
        },
        logout: (state) => {
            state.access_token = null;
            state.refresh_token = null;
            state.user = null;
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            state.status = "idle";
        },
        setUserLoading: (state) => {
            state.status = "loading";
        },
        setCurrentUser: (state, action: any) => {
            state.user = action.payload;
        },
        setUserIdle: (state) => {
            state.status = "idle";
        },
        updateAccessToken: (state, action) => {
            state.status = "idle";
            state.access_token = action.payload;
            localStorage.setItem("access_token", action.payload);
        },
    },
});

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const authReducer = authSlice.reducer;
