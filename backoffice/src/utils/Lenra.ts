import { LenraApp } from "@lenra/client";
import getEnv from "./Env";

export async function getLenraApp():Promise<LenraApp> {
    const global = window as any;
    let lenraApp = global.lenraApp;
    if (!lenraApp) {
        const env = await getEnv();
        lenraApp = new LenraApp({
            clientId: env.LENRA_CLIENT_ID,
            appName: env.LENRA_APP_NAME,
            isProd: !env.TEST,
        });
        if (!global.lenraApp) {
            global.lenraApp = lenraApp;
        }
    }
    return lenraApp;
}