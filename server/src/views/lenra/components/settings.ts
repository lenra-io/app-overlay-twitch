import { ViewRequest, DataApi, Component, Flex, IComponent, Form, TextField, Button, Text } from "@lenra/app"
import { ChannelAccess } from "../../../classes/ChannelAccess.js"

export default function ([access]: ChannelAccess[], _props: ViewRequest['props']): Component<IComponent> | IComponent {
    return Form(Flex([
        Text('Twitch Client ID:'),
        TextField('').name('clientId').autofocus(true),
        Text('Twitch Access Token:'),
        TextField('').name('token'),
        Button('Update Token').submit(true),
    ])
        .direction("vertical")
        .spacing(16)
        .mainAxisAlignment("spaceEvenly")
        .crossAxisAlignment("center")).onSubmit('updateToken')
}

