import { Api, ListenerRequest } from "@lenra/app";
import { WebHook, WebHookState } from "../classes/WebHook";

interface WebHookCreateRequest {
  action: string
  props: ListenerRequest['props']
}
interface WebHookCreateResponse {
  uuid: string
  action: string
  props: ListenerRequest['props']
  environment_id: number
  user_id: null
}

export async function create(owner: string, props: ListenerRequest['props'], api: Api) {

  const response = await fetch(new URL('/apps/webhooks', api.url), {
    method: 'POST',
    headers: api.data.headers(),
    body: JSON.stringify({
      action: "onEvent",
      props: props
    } as WebHookCreateRequest)
  })
  if (response.ok) {
    const result: WebHookCreateResponse = await response.json()
    return await api.data.coll(WebHook).createDoc(new WebHook(owner, result.uuid, null, WebHookState.READY))
  }
}

export async function trigger(webhook: WebHook, event: ListenerRequest['event'], api: Api) {
  const response = await fetch(new URL(webhook.url, api.url), {
    method: 'POST',
    headers: api.data.headers(),
    body: JSON.stringify(event)
  })
}
