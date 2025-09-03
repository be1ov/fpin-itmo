import { Button, Modal, Typography } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/slices/AuthSlice";

export default function TelegramModal() {
    const [isOpen, setIsOpen] = React.useState(false);

    const btnRef = React.useRef(null);

    const auth = useSelector(selectAuth)
    useEffect(() => {
        setIsOpen(!!auth.user && !auth.user.telegram?.is_confirmed);
    }, [auth])

    return <Modal title="Привязка Telegram" open={isOpen} onCancel={() => { setIsOpen(false) }} footer={null}>
        <Typography.Paragraph>
            Привет! Мы заметили, что ты еще не привязал аккаунт Telegram.
        </Typography.Paragraph>
        <Typography.Paragraph>
            Привязка Telegram позволит тебе получать важные уведомления и объявления прямо в мессенджер.
        </Typography.Paragraph>
        <Typography.Paragraph>
            Не упусти важную информацию и будь в курсе всех новостей!
        </Typography.Paragraph>
        <Button ref={btnRef} type="primary" href={
            auth.user?.telegram?.link || "#"
        } target="_blank" rel="noreferrer">Привязать Telegram</Button>
    </Modal>
}