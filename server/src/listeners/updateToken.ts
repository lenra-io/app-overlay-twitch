import { Api, ListenerRequest } from '@lenra/app';
import { ChannelAccess } from '../classes/ChannelAccess.js';
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChannelData } from '../classes/ChannelData.js';

export default async function (_props: ListenerRequest['props'], event: { value: ChannelAccess }, api: Api) {
    // Update or create the Webhook document that will contain the webhook token
    // And update the twitch login information.
    const coll = {
        ChannelAccess: api.data.coll(ChannelAccess),
        ChannelData: api.data.coll(ChannelData),
    };
    let [access] = await coll.ChannelAccess.find({});
    if (access) {
        let changed = false;
        event.value.clientId = event.value.clientId.trim();
        if (event.value.clientId.length > 0) {
            access.clientId = event.value.clientId;
            changed = true;
        }
        event.value.token = event.value.token.trim();
        if (event.value.token.length > 0) {
            access.token = event.value.token;
            changed = true;
        }
        if (changed) access = await coll.ChannelAccess.updateDoc(access);
    }
    else {
        access = await coll.ChannelAccess.createDoc(event.value);
    }
    // TODO: call the API to build the ChannelData document
    let [channelData] = await coll.ChannelData.find({});
    const authProvider = new StaticAuthProvider(access.clientId, access.token, ['channel:read:subscriptions', 'moderator:read:followers', 'bits:read'])
    const apiClient = new ApiClient({ authProvider });
    const currentUser = await apiClient.getTokenInfo();
    const [subs, /*bits,*/ follower] = await Promise.all([
        getSubscriptions(apiClient, currentUser.userId),
        // getBitsLeaderboard(apiClient, currentUser.userId),
        getLatestFollower(apiClient, currentUser.userId),
    ]);
    if (!channelData) channelData = new ChannelData();
    channelData.lastSubscriber = subs.last;
    channelData.subscriptionCount = subs.total;
    // channelData.last = bits;
    channelData.lastFollower = follower;
    channelData.lastUpdate = Date.now();
    if (channelData._id) await coll.ChannelData.updateDoc(channelData);
    else await coll.ChannelData.createDoc(channelData);
}

async function getSubscriptions(client: ApiClient, broadcasterId: string) {
    const subs = await client.subscriptions.getSubscriptions(broadcasterId, { limit: 1 });
    return { last: subs.data[0].userName, total: subs.total };
}

/**
 * Get the user name of the user who has given the most bits to the channel.
 * 
 * @returns {string} The user name of the user who has given the most bits to the channel.
 */
async function getBitsLeaderboard(client: ApiClient, broadcasterId: string) {
    // https://dev.twitch.tv/docs/api/reference/#get-bits-leaderboard

    let bitsLeaderboard = await client.bits.getLeaderboard(broadcasterId);

    return bitsLeaderboard.entries[0].userName;
}

/**
 * Get the user name of the latest follower.
 * 
 * @returns {string} The user name of the latest follower.
 */
async function getLatestFollower(client: ApiClient, broadcasterId: string) {
    // https://dev.twitch.tv/docs/api/reference/#get-channel-followers

    let latestFollower = await client.channels.getChannelFollowers(broadcasterId, null, { limit: 1 });

    return latestFollower.data[0].userName;
}
