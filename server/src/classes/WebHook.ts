import { Data } from "@lenra/app";

export class WebHook extends Data {
    token: string
    timestamp: number

    constructor(token: string, timestamp: number) {
        super();
        this.token = token;
        this.timestamp = timestamp;
    }
}
