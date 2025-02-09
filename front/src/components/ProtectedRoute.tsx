import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {selectAuth} from "../redux/slices/AuthSlice.ts";

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const auth = useSelector(selectAuth);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(auth)

        if (!auth.user && auth.status !== "loading") {
            navigate("/auth");
        }
    }, [auth]);

    if (auth.status === "loading") {
        return <p>Loading...</p>;
    }

    return <>{auth.user && children}</>;
};

export default ProtectedRoute;
