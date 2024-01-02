import { Listener } from "@lenra/app";
import { ChannelData } from "../classes/ChannelData.js";

export default function ([channelData]: ChannelData[], _props: any) {
  return channelData ?? new ChannelData();
}
