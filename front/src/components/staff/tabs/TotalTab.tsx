import { useEffect } from "react"
import axiosInstance from "../../../utils/axios"

export function TotalTab() {
    useEffect(() => {
        const fetchData = () => {
            axiosInstance.get(`/v1/table`).then(res => {

            })
        }

        fetchData()
    }, [])

    return <>
    </>
}