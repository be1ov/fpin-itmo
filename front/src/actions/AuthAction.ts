import {authSlice} from "../redux/slices/AuthSlice.ts";
import {store} from "../redux/store.ts";
import axiosInstance from "../utils/axios.ts";

export const login = (username: string, password: string) => {
    return axiosInstance
        .post("/auth/token/", {username, password})
        .then((res) => {
            store.dispatch(
                authSlice.actions.loginSuccess({
                    access_token: res.data.access,
                    refresh_token: res.data.refresh,
                })
            );
            return fetchCurrentUser();
        })
        .catch((error) => {
            console.error("Login failed:", error);
            store.dispatch(authSlice.actions.setUserIdle());
            return Promise.reject("Login failed");
        });
};

export const signup = (data: {
    firstName: string,
    lastName: string,
    patronymic: string,
    email: string,
    password: string,
    isu: string
}) => {
    return axiosInstance.post("/auth/signup", data).then(res => {
        store.dispatch(
            authSlice.actions.loginSuccess({
                access_token: res.data.data.access,
                refresh_token: res.data.data.refresh,
            })
        );
        return fetchCurrentUser();
    })
    .catch((error) => {
        console.error("Signup failed:", error);
        store.dispatch(authSlice.actions.setUserIdle());
        return Promise.reject("Signup failed");
    });
}

export const fetchCurrentUser = () => {
    const access_token = store.getState().auth.access_token;
    if (!access_token) {
        store.dispatch(authSlice.actions.logout());
        return;
    }

    store.dispatch(authSlice.actions.setUserLoading());

    axiosInstance
        .get("/auth/me/", {withCredentials: true})
        .then((res) => {
            if (res.status != 401 && res.status != 403) {
                store.dispatch(authSlice.actions.setCurrentUser(res.data));
                store.dispatch(authSlice.actions.setUserIdle());
            }
        })
        .catch(() => {
            store.dispatch(authSlice.actions.setUserIdle());
            store.dispatch(authSlice.actions.logout());
        });
};
