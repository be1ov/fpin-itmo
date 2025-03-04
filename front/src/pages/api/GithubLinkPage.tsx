import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axiosInstance from "../../utils/axios.ts";

export function GithubLinkPage () {
    const { search } = useLocation();

    const query = new URLSearchParams(search);
    const code = query.get('code');

    useEffect(() => {
        if (!code) {
            window.location.href = "/?status=gh_error"
            return;
        }

        axiosInstance.post("/v1/github/link", {
            code
        }).then(() => {
            window.location.href = "/?status=gh_success"
        }).catch(() => {
            window.location.href = "/?status=gh_error"
        })
    }, []);

    return <>{code}</>
}