import {Task} from "./Task.interface.ts";
import dayjs from "dayjs";
import {TaskSubmissionStatusInterface} from "./TaskSubmissionStatusInterface.ts";

export interface TaskSubmission {
    id: number;
    task: Task;
    date: dayjs.Dayjs;
    statuses: TaskSubmissionStatusInterface[];
}