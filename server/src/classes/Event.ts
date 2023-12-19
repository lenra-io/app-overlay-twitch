import { Data } from "@lenra/app";

export enum EventType {
    Follower = 'follower',
    Subscriber = 'subscriber',
    Donation = 'donation'
}

export class Event extends Data {
    type: EventType
    viewer: string
    timestamp: number

    constructor(type: EventType, viewer: string, timestamp: number) {
        super();
        this.type = type;
        this.viewer = viewer;
        this.timestamp = timestamp;
    }
}
