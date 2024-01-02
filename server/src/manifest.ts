import { Manifest, View } from '@lenra/app';
import { ChannelData } from './classes/ChannelData.js';
import { ChannelAccess } from './classes/ChannelAccess.js';

const manifest: Manifest = {
    json: {
        routes: [
            {
                path: "/data",
                view: View("channelData").find(ChannelData, {}).toJSON()
            }
        ]
    },
    lenra: {
        routes: [
            {
                path: '/',
                view: View('lenra.settings').toJSON()
            }
        ]
    }
};

export default manifest;