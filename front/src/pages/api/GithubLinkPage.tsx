import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios.ts';

export function GithubLinkPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const [redirected, setRedirected] = useState(false);  // Track redirection status

    useEffect(() => {
        if (redirected) return;  // Prevent further redirects if already redirected

        const query = new URLSearchParams(search);
        const code = query.get('code');

        if (!code) {
            // If no code is found, redirect to error page
            setRedirected(true);  // Mark that a redirect is happening
            navigate("/?status=gh_error");
            return;
        }

        axiosInstance.post("/v1/github/link/", { code })
            .then((res) => {
                console.log("API Response:", res);
                setRedirected(true);  // Mark that a redirect is happening
                // If the request is successful, redirect to success page
                navigate("/?status=gh_success");
            })
            .catch((err) => {
                console.log("API Error:", err);
                setRedirected(true);  // Mark that a redirect is happening
                // If there's an error, redirect to error page
                navigate("/?status=gh_error");
            });
    }, [search, navigate, redirected]);  // Add `redirected` to the dependency array

    return <>Processing...</>;
}
