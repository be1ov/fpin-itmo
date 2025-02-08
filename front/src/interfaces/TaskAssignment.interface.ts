import dayjs from "dayjs";
import {Task} from "./Task.interface.ts";

export interface TaskAssignment {
    id: number;
    task: Task;
    opens_at: dayjs.Dayjs;
    deadline: dayjs.Dayjs;
    max_points: string;
    isCompleted: boolean;
}