import { Api, ListenerRequest } from '@lenra/app';
import { WebHook, WebHookState } from '../classes/WebHook';
import * as WebhookService from '../services/webhook';

export async function onEnvStart(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
}

export async function onUserFirstJoin(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
}

export async function onSessionStart(props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    let webhook:WebHook = await api.data.coll(WebHook).find({ user: '@me' })?.[0];
    // TODO: Check if new followers/subs/donation
    if (webhook) {
        // TODO: Call the webhook that will start the twurple thread
        if (webhook.state != WebHookState.RUNNING) {
            await WebhookService.trigger(webhook, props, api)
        }
    }
}

export async function onSessionStop(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    // TODO: if no one left in the session for this token, stop the webhook thread
}

export async function onUserLeave(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {

}

export async function onEnvStop(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {

}
