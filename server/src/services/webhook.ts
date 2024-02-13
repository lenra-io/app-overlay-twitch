import { Api, ListenerRequest } from "@lenra/app";
import { WebHook, WebHookState } from "../classes/WebHook";

interface WebHookCreateRequest {
  listener: string
  props: ListenerRequest['props']
}
interface WebHookCreateResponse {
  uuid: string
  listener: string
  props: ListenerRequest['props']
  environment_id: number
  user_id: null
}

export async function create(owner: string, props: any, api: Api) {
  const coll = api.data.coll(WebHook);
  let webhook = await coll.createDoc(new WebHook(owner, null, null, WebHookState.CREATING));
  const response = await fetch(new URL('/app-api/v1/webhooks', api.url), {
    method: 'POST',
    headers: {
      ...api.data.headers(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      listener: "onEvent",
      props: {...props, webhook: webhook._id}
    })
  })
  if (response.ok) {
    const result = (await response.json()) as WebHookCreateResponse;
    return coll.updateDoc({...webhook, url: result.uuid, state: WebHookState.READY});
  }
  await coll.deleteDoc(webhook);
  throw new Error(`Error while creating the webhook: ${response.statusText}`);
}

export async function get(api: Api): Promise<WebHook> {
  const webhooks = await api.data.coll(WebHook).find({ user: '@me' });
  return webhooks[0];
}

export async function trigger(webhook: WebHook, event: ListenerRequest['event'], api: Api) {
  const response = await fetch(new URL(`/apps/00000000-0000-0000-0000-000000000000/webhooks/${webhook.url}`, api.url), {
    method: 'POST',
    headers: api.data.headers(),
    body: JSON.stringify(event)
  })
}

export function setState(webhook: WebHook, state: WebHookState, api: Api) {
  return api.data.coll(WebHook).updateDoc({...webhook, state: state});
}
