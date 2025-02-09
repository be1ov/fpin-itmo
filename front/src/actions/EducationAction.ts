import {store} from "../redux/store.ts";
import axiosInstance from "../utils/axios.ts";
import {educationSlice} from "../redux/slices/EducationSlice.ts";
import {authSlice} from "../redux/slices/AuthSlice.ts";

export const fetchEducationData = () => {
    store.dispatch(authSlice.actions.setUserLoading())
    axiosInstance.get("/v1/education/current").then(res => {
        store.dispatch(educationSlice.actions.setEducationData(res.data));
    }).finally(() => {
        store.dispatch(authSlice.actions.setUserIdle())
    })
}