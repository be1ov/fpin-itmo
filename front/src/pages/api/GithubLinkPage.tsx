import { useLocation} from "react-router-dom";
import {useEffect, useRef} from "react";
import axiosInstance from "../../utils/axios.ts";

export function GithubLinkPage() {
    const { search } = useLocation();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const query = new URLSearchParams(search);
        const code = query.get('code');

        if (!code) {
            window.location.href = "/?status=gh_error";
            return;
        }

        axiosInstance.post("/v1/github/link/", { code })
            .then((res) => {
                console.log("API Response:", res);
                window.location.href = "/?status=gh_success";
            })
            .catch((err) => {
                console.log("API Error:", err);
                window.location.href = "/?status=gh_error";
            });

    }, [search]);


    return <>Processing...</>;
}