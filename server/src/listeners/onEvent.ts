import { Api, ListenerRequest } from '@lenra/app'
import { Event, EventType } from '../classes/Event'
import { ApiClient } from '@twurple/api'
import { StaticAuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { EventSubWsListener } from "@twurple/eventsub-ws"
import TWITCH_SCOPES from '../utils/twitchScopes'

export default async function (props: { timestamp: number, twitchClientId: string, twitchAccessToken: string }, _event: ListenerRequest['event'], api: Api) {
    const authProvider = new StaticAuthProvider(props.twitchClientId, props.twitchAccessToken, TWITCH_SCOPES)
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
}
