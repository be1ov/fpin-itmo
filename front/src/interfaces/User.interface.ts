import { ITelegramAccount } from "./ITelegramAccount.interface";

export interface User {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    email: string;
    isu: string;
    is_approved: boolean;
    is_staff: boolean;
    github?: string;
    telegram?: ITelegramAccount;
}
