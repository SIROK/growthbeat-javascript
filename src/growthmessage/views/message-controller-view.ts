import MessageAction = require('../actions/message-action');
import MessageStore = require('../stores/message-store');
import DialogView = require('./dialog-view');

var styles = '/* STYLES */';

var el:HTMLStyleElement = document.createElement('style');
el.type = 'text/css';
el.innerHTML = styles;
document.getElementsByTagName('head')[0].appendChild(el);

interface Props {
    context: {
        messageAction:MessageAction;
        messageStore:MessageStore;
    };
}

interface State {
    message:any;
}

class MessageControllerView {
    el:HTMLDivElement = null;
    parent: any = null;
    props:Props = null;
    state:State = null;

    dialogView:DialogView = null;

    constructor(parent, props) {
        this.parent = parent;
        this.props = props;
        this.state = {
            message: this.props.context.messageStore.getMessage()
        };

        this.props.context.messageStore.on('change', this._onChange.bind(this));
    }

    render() {
        if (this.el == null) {
            var el = document.createElement('div');
            el.className = 'growthmessage';
            this.el = el;
            this.parent.appendChild(this.el);
        }

        if (this.state.message == null) {
            if (this.dialogView != null) {
                this.dialogView.dispose();
                this.dialogView = null;
            }
        } else {
            this.dialogView = new DialogView(this.el, {
                context: this.props.context,
                message: this.state.message
            });
            this.dialogView.render();
        }
    }

    _onChange() {
        console.log('_onChange');
        this.state = {
            message: this.props.context.messageStore.getMessage()
        };

        this.render();
    }

}

export = MessageControllerView;
