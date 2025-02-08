import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/slices/AuthSlice";

export function StaffOnlyGuard({children}: { children: React.ReactNode }) {
    const user = useSelector(selectAuth).user

    if (user?.is_staff) {
        return <>{children}</>
    }
}