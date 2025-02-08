import {AppDispatch} from "../redux/store.ts";
import axiosInstance from "../utils/axios.ts";
import {educationSlice} from "../redux/slices/EducationSlice.ts";

export const fetchEducationData = () => {
    return (dispatch: AppDispatch) => {
        axiosInstance.get("/v1/education/current").then(res => {
            dispatch(educationSlice.actions.setEducationData(res.data));
        })
    }
}