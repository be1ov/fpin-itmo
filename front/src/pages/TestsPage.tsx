import LayoutComponent from "../components/Layout.tsx";
import {Divider, Space, Spin, Typography} from "antd";
import React, {useEffect} from "react";
import Typing from 'react-typing-effect';
import TypingEffect from "../components/TypingEffect.tsx";

export default function TestsPage() {
    const [tests, setTests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const statuses = [
        "Придумываем задания...",
        "Пьём кофе...",
        "Портим картинки...",
        "Прячем правильные ответы...",
        "Урезаем баллы (несильно)",
        "Заставляем вас думать...",
        "Проверяем, насколько вы внимательны...",
        "Считаем, сколько раз вы перерешали...",
        "Делаем варианты максимально похожими...",
        "Добавляем странные формулировки...",
        "Придумываем вопросы, на которые сами не знаем ответ...",
        "Заменяем 'очевидный' ответ на другой...",
        "Просто статус по-приколу, + балл за внимательность",
        "Делаем так, чтобы 'всё выше перечисленное' не работало...",
        "Придумываем новые способы вас запутать...",
        "Прячем лёгкие вопросы среди сложных...",
        "Добавляем 'все ответы верны', но один — нет...",
        "Ставим таймер на сдачу, чтобы было веселее...",
        "Думаем, как повысить процент не сдавших...",
        "Ждём, когда вы запаникуете...",
    ];


    const [loadingText, setLoadingText] = React.useState(statuses[Math.floor(Math.random() * statuses.length)])
    useEffect(() => {
        setInterval(() => {
            setLoadingText(statuses[Math.floor(Math.random() * statuses.length)])
        }, 2100)

        setIsLoading(true)
    }, []);


    return <LayoutComponent>
        <Space direction={"vertical"} style={{
            width: "100%",
        }}>
            <Typography.Title level={2}>Тесты</Typography.Title>
            <Typography.Text>В этом разделе представлены тесты, которые вам предстоит пройти... и уже пройденные и зачтенные...
                и незачтенные тоже.
                <br/>Короче, все тесты. Здесь живут тесты.</Typography.Text>
            <Divider/>
            {
                isLoading && <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center"
                }}>
                    <Space direction={"vertical"}>
                        <Spin/>
                        {/*<Typing speed={20} eraseSpeed={loadingText.length} eraseDelay={1000}*/}
                        {/*        typingDelay={1000} text={loadingText}/>*/}

                        <TypingEffect texts={statuses} typingSpeed={20} erasingSpeed={20} delayBeforeErase={1500} />

                    </Space>

                </div>
            }
        </Space>
    </LayoutComponent>
}