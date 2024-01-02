import { ViewRequest, Component, Flex, IComponent, Text } from "@lenra/app"

export default function (_data: ViewRequest['data'], _props: ViewRequest['props']): Component<IComponent> | IComponent {
    return Flex([
        Text("Hello World!"),
    ])
        .direction("vertical")
        .spacing(16)
        .mainAxisAlignment("spaceEvenly")
        .crossAxisAlignment("center")
}

