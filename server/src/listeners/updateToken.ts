import { Api, ListenerRequest } from '@lenra/app';
import { Counter } from '../classes/Counter';
import { WebHook } from '../classes/WebHook';

export default async function(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    // TODO: Update or create the Webhook document that will contain the webhook token
    // And update the twitch login information.
}
