import { LenraApp, LenraSocket } from "@lenra/client";
import { computed, signal } from "@preact/signals";
import { render } from "preact";
import { Router } from "preact-router";
import { Loader } from "./components/Loader";
import { Home } from "./pages/Home";
import './style.css';
import { getLenraApp } from "./utils/Lenra";

const global = window as any;

const lenraAppSignal = signal<LenraApp>(undefined);
export let lenraApp: LenraApp;
export const lenraSocket = signal<LenraSocket>(undefined);
export const connecting = signal<boolean>(false);
export const isLoggedIn = computed(() => {
	return !!lenraSocket.value;
});

async function initLenraApp() {
    if (lenraApp) return;
    lenraApp = await getLenraApp();
    lenraSocket.value = lenraApp.lenraSocket;
    lenraAppSignal.value = lenraApp;

		if (!global.userSignal) {
			// if (sessionStorage.getItem("access_token"))
				connect();
		}
}

async function connect() {
	connecting.value = true;
	lenraSocket.value = await lenraApp.connect().finally(() => connecting.value = false);
}

export async function disconnect() {
	lenraSocket.value = null;
	// currentUser.value = null;
	lenraApp.disconnect();
}

const Main = () => {
    if (!isLoggedIn.value) {
			if (connecting.value)
        return <Loader />;
			return <button class="primary" onClick={connect}>Connexion</button>;
    }
    return (
        <Router>
            <Home path="/" />
						<p default>Page non trouvée</p>
        </Router>
    )
};

initLenraApp();

render(<Main />, document.body);
