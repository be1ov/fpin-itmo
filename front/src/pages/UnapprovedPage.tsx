import {Divider, Layout, theme, Typography} from "antd";
import {ChangeThemeButton} from "../components/ChangeThemeButton.tsx";

export default function UnapprovedPage() {
    const {
        token: {colorBgContainer,},
    } = theme.useToken();

    return <Layout style={{height: '100vh'}}>
        <Layout.Header style={{
            backgroundColor: colorBgContainer,
            display: 'flex', alignItems: 'center',
            justifyContent: "space-between",
        }}>
            <Typography.Title style={{
                margin: 0,
                padding: 0
            }} level={2}>PIN.DB</Typography.Title>
            <ChangeThemeButton/>
        </Layout.Header>
        <Layout.Content style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
            <Typography.Title>Ой!</Typography.Title>
            <Typography.Text style={{textAlign: "center"}}>Учётная запись не подтверждена.<br />
            Обратитесь к администратору портала.</Typography.Text>
        </Layout.Content>
        <Layout.Footer style={{textAlign: 'center'}}>
            <Divider/>
            Университет ИТМО, факультет прикладной информатики ©{new Date().getFullYear()} Created by &lt;be1ov /&gt;
        </Layout.Footer>
    </Layout>
}