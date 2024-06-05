let env:Env|null = null;

interface Env {
    LENRA_CLIENT_ID: string
    LENRA_APP_NAME: string
    TEST?: boolean
}

export default async function getEnv():Promise<Env> {
    if (env === null) {
        env = await fetch("/env.json").then(response => response.json());
    }
    return env;
}