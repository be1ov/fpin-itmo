import { authSlice } from "../redux/slices/AuthSlice.ts";
import axios from "../utils/axios.ts";
import { store } from "../redux/store.ts";
import {fetchEducationData} from "./EducationAction.ts";

// export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
//     try {
//         const response = await axios.post('/auth/token/', { username, password });
//         dispatch(loginSuccess({
//             access_token: response.data.access,
//             refresh_token: response.data.refresh
//         }));
//         return Promise.resolve();
//     } catch (error) {
//         console.error('Login failed', error);
//         return Promise.reject()
//     }
// }

// export const login = (username: string, password: string) => {

// }

export const login = (username: string, password: string) => {
    return axios
        .post("/auth/token/", { username, password })
        .then((res) => {
            store.dispatch(
                authSlice.actions.loginSuccess({
                    access_token: res.data.access,
                    refresh_token: res.data.refresh,
                })
            );
            fetchEducationData();
            return fetchCurrentUser();
        })
        .catch((error) => {
            console.error("Login failed:", error);
            store.dispatch(authSlice.actions.setUserIdle());
            return Promise.reject("Login failed");
        });
};

export const fetchCurrentUser = () => {
    const access_token = store.getState().auth.access_token;
    if (!access_token) {
        store.dispatch(authSlice.actions.setCurrentUser(null));
    }

    store.dispatch(authSlice.actions.setUserLoading());

    axios
        .get("/auth/me/", { withCredentials: true })
        .then((res) => {
            store.dispatch(authSlice.actions.setCurrentUser(res.data));
        })
        .catch((err) => {
            store.dispatch(authSlice.actions.setCurrentUser(null));
        });
};
