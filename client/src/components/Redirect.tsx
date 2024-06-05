import { Component } from 'preact';
import { route } from 'preact-router';

export default class Redirect extends Component<{to: string}> {
  componentWillMount() {
    console.log("Redirecting to", this.props.to, route(this.props.to, true));
  }
  render() {
    return null;
  }
}