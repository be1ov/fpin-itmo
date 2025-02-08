import {User} from "./User.interface.ts";
import dayjs from "dayjs";

export interface TaskSubmissionStatusInterface {
    id: number;
    text: string;
    author: User;
    date: dayjs.Dayjs;
    status: string;
}