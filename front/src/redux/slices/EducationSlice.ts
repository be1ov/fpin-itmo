import {createSlice} from '@reduxjs/toolkit';

interface Semester {
    id: number;
    title: string;
    from_date: string;
    to_date: string;
    base_repo_url: string;
    status: "idle" | "loading";
}

interface Flow {
    id: number;
    title: string;
}

interface EducationData {
    semester: Semester|null;
    flows: Flow[];
    status: "idle" | "loading";
}

const initialState: EducationData = {
    semester: null,
    flows: [],
    status: "idle"
};

export const educationSlice = createSlice({
    name: 'semester',
    initialState,
    reducers: {
        setEducationData: (state, action) => {
            state.semester = action.payload.semester;
            state.flows = action.payload.flows;
            state.status = "idle";
        }
    },
});

export const selectEducationData = (state: { education: EducationData }) => state.education;
export const educationReducer = educationSlice.reducer;
