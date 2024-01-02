import { Data } from "@lenra/app";

export class ChannelData extends Data {
    lastFollower: string
    lastSubscriber: string
    subscriptionCount: number
    donation: string
    lastUpdate: number

    constructor(lastFollower: string = "", lastSubscriber: string = "", subscriptionCount: number = 0, donation: string = "", lastUpdate: number = 0) {
        super();
        this.lastFollower = lastFollower;
        this.lastSubscriber = lastSubscriber;
        this.subscriptionCount = subscriptionCount;
        this.donation = donation;
        this.lastUpdate = lastUpdate;
    }
}
