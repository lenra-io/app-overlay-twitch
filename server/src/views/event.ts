import { Listener } from "@lenra/app";
import { Event, EventType } from "../classes/Event.js";

export default function (events: Event[], _props: any) {
  return events.map((e) => {
    return {
      type: e.type,
      value: e.viewer
    }
  });
}
