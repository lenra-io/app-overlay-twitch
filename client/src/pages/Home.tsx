
import OBSWebSocket from 'obs-websocket-js';
import { Component } from "preact";
import Page from "../components/Page.js";

const obs = new OBSWebSocket();

interface State {
	connecting: boolean
	connected: boolean
	currentScene: string
}

const testData =

{
	collectionName: "Collection de scènes",
	sceneTransition: "Fondu",
	scenes: [
		{
			sceneName: "Scène 1",
			inputs: [
				{
					kind: "pulse_input_capture",
					enabled: true,
					index: 0,
					sourceName: "micro"
				},
				{
					kind: "v4l2_input",
					enabled: true,
					index: 1,
					sourceName: "webcam",
					transformation: {
						rotation: 0,
						width: 960,
						height: 540,
						sourceWidth: 1920,
						sourceHeight: 1080,
						position: {
							x: 0,
							y: 0
						}
					}
				},
				{
					kind: "browser_source",
					enabled: true,
					index: 2,
					sourceName: "overlay",
					transformation: {
						rotation: 0,
						width: 1920,
						height: 1080,
						sourceWidth: 1920,
						sourceHeight: 1080,
						position: {
							x: 0,
							y: 0
						}
					}
				}
			]
		},
		{
			sceneName: "Scène 2",
			inputs: [
				{
					kind: "pulse_input_capture",
					enabled: true,
					index: 0,
					sourceName: "micro"
				},
				{
					kind: "v4l2_input",
					enabled: true,
					index: 1,
					sourceName: "webcam",
					transformation: {
						rotation: 0,
						width: 960,
						height: 540,
						sourceWidth: 1920,
						sourceHeight: 1080,
						position: {
							x: 960,
							y: 540
						}
					}
				},
				{
					kind: "browser_source",
					enabled: true,
					index: 2,
					sourceName: "overlay",
					transformation: {
						rotation: 0,
						width: 1920,
						height: 1080,
						sourceWidth: 1920,
						sourceHeight: 1080,
						position: {
							x: 0,
							y: 0
						}
					}
				}
			]
		}
	]
};

export class Home extends Component<any, State> {
	render() {
		if (this.state.connected) {
			return <Page title="Accueil">
				<p>Connecté à OBS</p>
				<p>Scène courante: {this.state.currentScene}</p>
			</Page>;
		}
		return <Page title="Accueil">
			<form onSubmit={this.connect.bind(this)}>
				<label>
					OBS Password
					<input type="password" name="password" />
				</label>
				<button disabled={this.state.connecting}>Connexion à OBS</button>
			</form>
		</Page>;
	}

	connect(e) {
		e.stopPropagation();
		e.preventDefault();

		if (this.state.connecting) return;
		this.setState({ connecting: true });

		obs.connect(undefined, e.currentTarget.password.value).then(async () => {
			const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
			const sceneListResponse = await obs.call('GetSceneList');
			const scenes = sceneListResponse.scenes;
			console.log(sceneListResponse, scenes);
			const inputKindListResponse = await obs.call('GetInputKindList');
			console.log(inputKindListResponse);
			const currentSceneInputs = await obs.call('GetSceneItemList', { sceneName: currentProgramSceneName });
			console.log(currentSceneInputs);
			this.setState({ connected: true, connecting: false, currentScene: currentProgramSceneName });
		})
			.catch(err => {
				console.error(err);
				this.setState({ connecting: false });
			});
	}

	synchronize() {
		/*
		Initialisation de OBS:
		# Initialiser la collection de scène
		Vérification de la collection de scene: GetSceneCollectionList
		La créer si elle n'existe pas avec toutes les scenes correspondantes: CreateSceneCollection
		Et la définir en collection de scène courante: SetCurrentSceneCollection
		
		# Initialiser la liste des transitions de scène 
		// Voir le move: https://obsproject.com/forum/resources/move.913/
		Vérification de la liste des transitions de scène: GetSceneTransitionList
		La créer si elle n'existe pas avec toutes les transitions correspondantes: CreateSceneTransition
		
		# Gestion des sources
		La supprimer si elle n'existe pas: RemoveInput
		La créer si elle n'existe pas: CreateInput
		Synchroniser les propriétés de la source: SetInputSettings

		# Gestiondes scènes
		Pour chaque scène vérifier qu'elle existe dans la collection de scène courante: GetSceneList
		Supprimer les scènes qui n'existent pas: RemoveScene
		La créer si elle n'existe pas: CreateScene

		## Gestion des sources de scène
		Pour chaque source de chaque scène vérifier qu'elle existe: GetInputItemList
		Supprimer les sources qui n'existent pas: RemoveSceneItem
		La créer si elle n'existe pas: CreateSceneItem
		*/

	}
}


/*
Déclencher le démarrage du stream lorsque l'on reçoit la demande du backoffice: StartStream
*/
