import {store} from "../redux/store.ts";
import axiosInstance from "../utils/axios.ts";
import {educationSlice} from "../redux/slices/EducationSlice.ts";

export const fetchEducationData = () => {
    axiosInstance.get("/v1/education/current").then(res => {
        store.dispatch(educationSlice.actions.setEducationData(res.data));
    })
}