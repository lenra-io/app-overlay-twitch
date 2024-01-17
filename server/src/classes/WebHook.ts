import { Data } from "@lenra/app";

export enum WebHookState {
    CREATING = 0,
    READY,
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
