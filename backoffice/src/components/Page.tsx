import { Component, ComponentChild, ComponentChildren } from "preact";

interface Props {
	title: string;
	mainButton?: ComponentChild;
}

export default class Page extends Component<Props> {
	render() {
		return (
			<main>
				<header>
					<h1>{this.props.title}</h1>
					{this.props.mainButton}
				</header>
				{this.props.children}
			</main>
		);
	}
}