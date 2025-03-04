import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axiosInstance from "../../utils/axios.ts";

export function GithubLinkPage () {
    const { search } = useLocation();


    useEffect(() => {
        const query = new URLSearchParams(search);
        const code = query.get('code');

        if (!code) {
            window.location.href = "/?status=gh_error"
            return;
        }

        axiosInstance.post("/v1/github/link/", {
            code
        }).then((res) => {
            console.log(res)
            window.location.href = "/?status=gh_success"
        }).catch((err) => {
            console.log(err)
            window.location.href = "/?status=gh_error"
        })
    }, []);

    return <>Processing...</>
}