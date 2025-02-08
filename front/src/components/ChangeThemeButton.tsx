import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";
import {MoonOutlined, SunOutlined} from "@ant-design/icons";
import * as React from "react";
import {changeTheme, selectTheme} from "../redux/slices/ThemeSlice.ts";

export function ChangeThemeButton({style}: {style?: React.CSSProperties}) {
    const enabledTheme = useSelector(selectTheme).mode;
    const dispatch = useDispatch()

    return <Button
        type={"text"}
        onClick={() => dispatch(changeTheme())}
        icon={
            enabledTheme == "dark" ? <SunOutlined /> : <MoonOutlined />
        } style={style} />

}