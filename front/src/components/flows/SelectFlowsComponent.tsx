import {useEffect, useState} from "react";
import {Select} from "antd";
import axiosInstance from "../../utils/axios.ts";
import {AxiosError} from "axios";

export default function SelectFlowsComponent({selectedFlows, setSelectedFlows}: {
    selectedFlows: any,
    setSelectedFlows: any
}) {
    const [flows, setFlows] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            axiosInstance.get(`/v1/flows`).then(res => {
                const data = res.data
                if (data.status != "success") {
                    throw new AxiosError()
                }

                setFlows(data.data.flows)
            })
        }

        fetchData()
    }, []);

    return (
        <Select
            mode="multiple"
            placeholder="Потоки"
            value={selectedFlows}
            onChange={setSelectedFlows}
            style={{width: '100%'}}
            options={flows.map(item => {
                return {
                    value: item.id,
                    label: item.title
                }
            })}
        />
    );
}