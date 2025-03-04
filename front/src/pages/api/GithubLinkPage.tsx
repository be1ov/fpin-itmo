import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axiosInstance from "../../utils/axios.ts";

export function GithubLinkPage () {
    const { search } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(search);
        const code = query.get('code');

        console.log(code)
        
        if (!code) {
            navigate("/?status=gh_error");
            return;
        }

        axiosInstance.post("/v1/github/link/", {
            code
        }).then((res) => {
            console.log(res);
            navigate("/?status=gh_success");
        }).catch((err) => {
            console.log(err);
            navigate("/?status=gh_error");
        });
    }, [search, navigate]);

    return <>Processing...</>;
}