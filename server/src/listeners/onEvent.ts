import { Api, ListenerRequest } from '@lenra/app'
import { Event, EventType } from '../classes/Event'
import { ApiClient } from '@twurple/api'
import { StaticAuthProvider, AccessToken } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { EventSubWsListener } from "@twurple/eventsub-ws"
import TWITCH_SCOPES from '../utils/twitchScopes'
import { WebHook, WebHookState } from '../classes/WebHook'
import * as WebhookService from '../services/webhook';
import { ChannelAccess } from '../classes/ChannelAccess.js'
import { ChannelData } from '../classes/ChannelData.js'

export default async function (props: {webhook: string, access: ChannelAccess, data: ChannelData}, event: {}, api: Api) {
    let webhook = await api.data.coll(WebHook).getDoc(props.webhook);
    let data = props.data;
    try {
        await WebhookService.setState(webhook, WebHookState.INIT, api)
        const authProvider = new StaticAuthProvider(props.access.clientId, { accessToken: props.access.accessToken, refreshToken: props.access.refreshToken } as AccessToken, TWITCH_SCOPES)
        const apiClient = new ApiClient({ authProvider })
        // listen to twitch API
        const currentUser = await apiClient.getTokenInfo()
        if (!currentUser?.userName) {
            throw new Error('Token have no userName set !')
        }
        const chatClient = new ChatClient({
            channels: [currentUser.userName],
            isAlwaysMod: true,
            authProvider: authProvider
        })
        chatClient.onConnect(() => {
            console.log('chatClient connected');
        });
        const eventSubClient = new EventSubWsListener({ apiClient })
        console.log('chatClient connected', chatClient);
        eventSubClient.onChannelFollow(currentUser.userId, currentUser.userId, async (msg) => {
            console.log('onChannelFollow', msg);
            data = await api.data.coll(ChannelData).updateDoc({...data, lastFollower: msg.userName})
        })
        eventSubClient.onChannelSubscription(currentUser.userId, async (msg) => {
            console.log('onChannelSubscription', msg);
            // await api.data.coll(Event).updateMany({ type: EventType.Subscriber }, {
            //     viewer: msg.userName
            // })
        })
        console.log("connecting...")
        chatClient.connect()
        eventSubClient.start();
        await WebhookService.setState(webhook, WebHookState.RUNNING, api)
    } catch (e) {
        await WebhookService.setState(webhook, WebHookState.FAILED, api)
    }
}
