import { Api, ListenerRequest } from '@lenra/app';
import { Counter } from '../classes/Counter';
import { WebHook } from '../classes/WebHook';

export async function onEnvStart(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    await createCounter(api, "global");
}

export async function onUserFirstJoin(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    await createCounter(api, "@me");
}

export async function onSessionStart(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    const webhook = (await api.data.coll(WebHook).find({}, {})).data
    // TODO: Check if new followers/subs/donation
    if (webhook.length !== 0) {
        // TODO: Call the webhook that will start the twurple thread
    }
}

export async function onSessionStop(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {
    // TODO: if no one left in the session for this token, stop the webhook thread
}

export async function onUserLeave(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {

}

export async function onEnvStop(_props: ListenerRequest['props'], _event: ListenerRequest['event'], api: Api) {

}

async function createCounter(api: Api, user: string) {
    const counterColl = api.data.coll(Counter);
    let counters = await counterColl.find({ user })
    if (counters.length == 0) {
        await counterColl.createDoc(new Counter(user, 0))
    }
}