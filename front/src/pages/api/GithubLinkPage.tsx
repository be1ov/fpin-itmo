import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios.ts';

export function GithubLinkPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);  // Track loading state
    const [error, setError] = useState(null);  // Track any errors

    // Make the request on component mount
    useEffect(() => {
        const query = new URLSearchParams(search);
        const code = query.get('code');

        if (!code) {
            navigate("/?status=gh_error");
            return;
        }

        // Make the API request
        axiosInstance.post("/v1/github/link/", { code })
            .then((res) => {
                console.log("API Response:", res);
                navigate("/?status=gh_success");
            })
            .catch((err) => {
                console.log("API Error:", err);
                navigate("/?status=gh_error");
            })
            .finally(() => {
                setLoading(false);  // Set loading to false after request is complete
            });

    }, [search, navigate]);  // Only trigger when `search` changes

    if (loading) {
        return <>Processing...</>;  // Display loading state while the request is in progress
    }

    return null;  // No need to render anything after request is completed
}
