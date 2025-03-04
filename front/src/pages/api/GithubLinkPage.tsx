import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axiosInstance from "../../utils/axios.ts";

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

        (async () => {
            try {
                const res = await axiosInstance.post("/v1/github/link/", { code });
                console.log(res);
                navigate("/?status=gh_success");
            } catch (err) {
                console.log(err);
                navigate("/?status=gh_error");
            }
        })();
    }, [search, navigate]);

    return <>Processing...</>;
}