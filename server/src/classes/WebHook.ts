import { Data } from "@lenra/app";

export enum WebHookState {
    READY = 0,
    INIT,
    RUNNING,
    SUCCEEDED,
    CANCELLED,
    FAILED
}

export class WebHook extends Data {
    user: string
    url: string
    timestamp: number
    state: WebHookState

    constructor(user: string, url: string, timestamp: number, state: WebHookState = WebHookState.READY) {
        super();
        this.user = user;
        this.url = url;
        this.timestamp = timestamp;
        this.state = state;
    }
}
