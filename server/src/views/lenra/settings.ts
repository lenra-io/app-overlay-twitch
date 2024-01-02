import { ViewRequest, Component, Flex, IComponent, View, Container } from "@lenra/app"
import { ChannelAccess } from "../../classes/ChannelAccess.js"


export default function (_data: ViewRequest['data'], _props: ViewRequest['props']): Component<IComponent> | IComponent {
  return Flex([
    View("lenra.menu"),
    Container(
      View("lenra.components.settings").find(ChannelAccess, {})
    )
    .maxWidth(600)
  ])
    .direction("vertical")
    .scroll(true)
    .spacing(4)
    .crossAxisAlignment("center")
}

