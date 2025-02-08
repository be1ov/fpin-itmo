import {message, Modal, Typography} from "antd";
import SelectFlowsComponent from "./SelectFlowsComponent.tsx";
import {useState} from "react";
import axiosInstance from "../../utils/axios.ts";
import {getMessage} from "../../utils/messages.ts";

export default function FlowsSignUpModal({isOpen, setIsOpen}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}) {
    const [selectedFlows, setSelectedFlows] = useState([]);

    const [messageApi, contextHolder] = message.useMessage();

    return <>
        {contextHolder}
        <Modal
            title={"Форма саморегистрации (Поток)"}
            open={isOpen}
            okText={"Отправить"}
            cancelText={"Закрыть"}
            onCancel={() => {
                setIsOpen(false);
            }}
            onOk={() => {
                axiosInstance.post("/v1/flows/request/", {
                    "flows": selectedFlows,
                }).then(() => {
                    setIsOpen(false);
                }).catch((res) => {
                    const message = res.response.data.message
                    messageApi.error(getMessage(message))
                })
            }}>
            <Typography.Paragraph>
                Всё, что нам нужно – номера потоков, в которые ты был зачислен по итогам выборности
            </Typography.Paragraph>
            <Typography.Paragraph>
                Если забыл, то узнать можно, например, <Typography.Link href={"https://my.itmo.ru/election"}>здесь
                (my.itmo)</Typography.Link>
            </Typography.Paragraph>
            <SelectFlowsComponent selectedFlows={selectedFlows} setSelectedFlows={setSelectedFlows}/>
        </Modal>
    </>
}