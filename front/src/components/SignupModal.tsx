import {Alert, Form, Input, Modal} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";

export function SignupModal({isOpened, setIsOpened}: {isOpened: boolean, setIsOpened: (value: boolean) => void}) {
    return <Modal open={isOpened} onCancel={() => setIsOpened(false)} cancelText={"Закрыть"} okText={"Зарегистрироваться"} title={"Регистрация"}>
        <Form>
            <Form.Item style={{marginBottom: 10, marginTop: 20}}>
                <Input size={"large"} placeholder="Фамилия" />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="Имя" />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="Отчество" />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="E-mail" prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="Табельный номер" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input.Password size={"large"} placeholder="Пароль" prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input.Password size={"large"} placeholder="Повтор пароля" prefix={<LockOutlined />} />
            </Form.Item>
        </Form>
        <Alert type={"warning"} message={"После регистрации будет необходимо дождаться утверждения учетной записи администратором портала"} />
    </Modal>
}