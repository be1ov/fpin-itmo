import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/slices/AuthSlice";

export default function TelegramModal() {
    const [isOpen, setIsOpen] = React.useState(false);

    const btnRef = React.useRef(null);

    const auth = useSelector(selectAuth)
    useEffect(() => {
        setIsOpen(!!auth.user && !auth.user.telegram);
    }, [auth])

    return <Modal title="Привязка Telegram" open={isOpen} onCancel={() => { setIsOpen(false) }} footer={null}>
        <p>Для получения уведомлений о новых материалах и важных объявлениях, пожалуйста, привяжите ваш аккаунт Telegram.</p>
        <p>После привязки вы сможете получать уведомления прямо в ваш Telegram-аккаунт.</p>
        <p>Чтобы привязать аккаунт, нажмите на кнопку ниже и следуйте инструкциям.</p>
        <Button ref={btnRef} type="primary" href={
            auth.user?.telegram?.link || "#"
        } target="_blank" rel="noreferrer">Привязать Telegram</Button>
    </Modal>
}