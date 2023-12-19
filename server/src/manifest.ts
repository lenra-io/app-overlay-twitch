import { Manifest, View } from '@lenra/app';
import { Counter } from './classes/Counter.js';
import { Event, EventType } from './classes/Event.js';

const manifest: Manifest = {
    json: {
        routes: [
            {
                path: "/counter/global",
                view: View("counter").find(Counter, {
                    "user": "global"
                }).toJSON()
            },
            {
                path: "/counter/me",
                view: View("counter").find(Counter, {
                    "user": "@me"
                }).toJSON()
            },
            {
                path: "/lastInfos",
                view: View("event").find(Event, {}).toJSON()
            }
        ]
    },
    lenra: {
        routes: [
            {
                path: "/",
                view: View("lenra.main").toJSON()
            },
            {
                path: '/settings',
                view: View('lenra.settings').toJSON()
            }
        ]
    }
};

export default manifest;