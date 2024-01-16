import { Api, ListenerRequest } from '@lenra/app'
import { Event, EventType } from '../classes/Event'
import { ApiClient } from '@twurple/api'
import { StaticAuthProvider, AccessToken } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { EventSubWsListener } from "@twurple/eventsub-ws"
import TWITCH_SCOPES from '../utils/twitchScopes'
import { WebHook, WebHookState } from '../classes/WebHook'

export default async function (webhook: WebHook, event: { timestamp: number, twitchClientId: string, twitchAccessToken: string, twitchRefreshToken: string }, api: Api) {
    try {
        changeWebhookState(webhook, WebHookState.INIT, api)
        const authProvider = new StaticAuthProvider(event.twitchClientId, { accessToken: event.twitchAccessToken, refreshToken: event.twitchRefreshToken } as AccessToken, TWITCH_SCOPES)
        const apiClient = new ApiClient({ authProvider })
        // TODO: listen to twitch API
        const currentUser = await apiClient.getTokenInfo()
        if (!currentUser?.userName) {
            throw new Error('Token have no userName set !')
        }
        const chatClient = new ChatClient({
            channels: [currentUser.userName],
            isAlwaysMod: true,
            authProvider: authProvider
        })
        const eventSubClient = new EventSubWsListener({ apiClient })
        chatClient.connect()
        eventSubClient.onChannelFollow(currentUser.userId, currentUser.userId, async (msg) => {
            await api.data.coll(Event).updateMany({ type: EventType.Follower }, {
                viewer: msg.userName
            })
        })
        eventSubClient.onChannelSubscription(currentUser.userId, async (msg) => {
            await api.data.coll(Event).updateMany({ type: EventType.Subscriber }, {
                viewer: msg.userName
            })
        })
        changeWebhookState(webhook, WebHookState.RUNNING, api)
    } catch (e) {
        changeWebhookState(webhook, WebHookState.FAILED, api)
    }
}

async function changeWebhookState(webhook: WebHook, state: WebHookState, api: Api) {
    api.data.coll(WebHook).updateMany({ $set: {
        _id: webhook._id
    } as WebHook}, { state: state } as WebHook)
}
