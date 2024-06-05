import { Component, createRef } from "preact";
import "./Modal.css";

interface Props {
    show?: boolean
    onClose?: () => void
    onSubmit: (data: FormData) => Promise<void>
    children: any
    header?: any
    footer?: any
}

interface State {
    error?: Error
}

export default class Modal extends Component<Props, State> {
    ref = createRef();

    render({ children }) {
        return (
            <dialog class="modal" ref={this.ref} onClose={this.props.onClose} onClick={
                e => {
                    const dialog = e.currentTarget;
                    var rect = dialog.getBoundingClientRect();
                    var isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
                    if (!isInDialog) {
                        dialog.close();
                    }
                }
            }>
                <button class="close" onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.ref.current.close();
                }}>
                    Fermer
                </button>
                <form method="dialog" onSubmit={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    this.props
                        .onSubmit(data)
                        .then(() => this.ref.current.close())
                        .catch(error => this.setState({ error }));
                }}>
                    {this.props.header}
                    {this.state.error &&
                        <p class="error">
                            {this.state.error.message}
                        </p>
                    }
                    <fieldset>
                        {children}
                    </fieldset>
                    {this.props.footer}
                </form>
            </dialog>
        );
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if (nextProps.show) {
            this.ref.current.showModal();
        } else {
            this.ref.current.close();
        }
    }
}