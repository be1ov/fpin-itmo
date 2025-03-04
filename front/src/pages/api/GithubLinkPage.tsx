import { useLocation, useNavigate } from "react-router-dom";
import {useCallback, useEffect, useRef} from "react";
import axiosInstance from "../../utils/axios.ts";

export function GithubLinkPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    const stableNavigate = useCallback(navigate, []);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const query = new URLSearchParams(search);
        const code = query.get('code');

        if (!code) {
            stableNavigate("/?status=gh_error");
            return;
        }

        axiosInstance.post("/v1/github/link/", { code })
            .then(() => stableNavigate("/?status=gh_success"))
            .catch(() => stableNavigate("/?status=gh_error"));
    }, [search, stableNavigate]);


    return <>Processing...</>;
}