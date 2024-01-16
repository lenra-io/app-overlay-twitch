import { Data } from "@lenra/app";

export class ChannelAccess extends Data {
    clientId: string
    accessToken: string
    refreshToken: string
}
