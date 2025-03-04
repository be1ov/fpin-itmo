import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import axiosInstance from "../../utils/axios.ts";

export function GithubAuthPage() {
    const { search } = useLocation();

    const query = new URLSearchParams(search);
    const code = query.get('code');

    useEffect(() => {
        if (!code) {
            window.location.href = "/?status=gh_error"
            return;
        }

        axiosInstance.post("/auth/github/", {
            code
        }).then((res) => {
            localStorage.access_token = res.data.data.access;
            localStorage.refresh_token = res.data.data.refresh;
            window.location.href = "/"
        }).catch(() => {
            window.location.href = "/"
        })
    }, []);

    return <>{code}</>

}