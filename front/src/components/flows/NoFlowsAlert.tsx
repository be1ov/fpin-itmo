import {Alert, Button} from "antd";
import {FormOutlined} from "@ant-design/icons";
import FlowsSignUpModal from "./FlowsSignUpModal.tsx";
import React from "react";

export default function NoFlowsAlert() {
    const [isOpen, setIsOpen] = React.useState(false);
    return <>
        <FlowsSignUpModal isOpen={isOpen} setIsOpen={setIsOpen} />

        <Alert
            type="warning"
            message={"Ты ещё не в потоке, но это легко исправить!"}
            description={"Давай сделаем это прямо сейчас? Обещаем, это будет быстро!"}
            action={<Button type={"primary"} onClick={() => {
                setIsOpen(true);
            }}>
                Вступить в поток
            </Button>}
            showIcon
            icon={<FormOutlined/>}
        />
    </>
}