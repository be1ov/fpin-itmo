import { useLocation} from "react-router-dom";
import {useEffect, useRef} from "react";
import axiosInstance from "../../utils/axios.ts";
import { useNavigate } from 'react-router-dom';

export function GithubLinkPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const query = new URLSearchParams(search);
        const code = query.get('code');

        if (!code) {
            navigate("/?status=gh_error");
            return;
        }

        axiosInstance.post("/v1/github/link/", { code })
            .then((res) => {
                console.log("API Response:", res);
                navigate("/?status=gh_success");
            })
            .catch((err) => {
                console.log("API Error:", err);
                navigate("/?status=gh_error");
            });
    }, [search, navigate]); // Add navigate to dependencies

    return <>Processing...</>;
}