import axios from "axios";
import { store } from "../redux/store.ts";
import { authSlice } from "../redux/slices/AuthSlice.ts";

const axiosInstance = axios.create({
    baseURL: "https://fpin-itmo.ru/api",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.access_token;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = store.getState().auth.refresh_token;
                if (!refreshToken)
                    throw new Error("No refresh token available");

                const response = await axiosInstance.post(
                    "/auth/token/refresh/",
                    {
                        refresh: refreshToken,
                    }
                );
                const { access } = response.data;

                store.dispatch(authSlice.actions.updateAccessToken(access));
                originalRequest.headers["Authorization"] = `Bearer ${access}`;

                return axios(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                store.dispatch(authSlice.actions.logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
