import { ViewRequest, DataApi, Component, Flex, IComponent, Form, TextField, Button } from "@lenra/app"
import { Counter } from "../../classes/Counter.js"

export default function (_data: ViewRequest['data'], _props: ViewRequest['props']): Component<IComponent> | IComponent {
    return Form(Flex([
        TextField('').name('twitchClientId'),
        TextField('').name('twitchAccessToken')
    ])
        .direction("vertical")
        .spacing(16)
        .mainAxisAlignment("spaceEvenly")
        .crossAxisAlignment("center")).onSubmit('updateTwitchToken')
}

