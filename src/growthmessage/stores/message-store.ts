import Emitter = require('component-emitter');

var convert = (data:any):any => {
    var newButtons = [];
    data.buttons.forEach((button:any)=> {
        if (button.type === 'screen') {
            data._screen = button;
            if (button.intent.type === 'url') {
                data._screenIsUrlType = true;
            }
        } else if (button.type === 'close') {
            data._close = button;
            data._closeElClass = 'js__growthmessage-dialog__element-close';
        } else {
            if (button.intent.type === 'url') {
                button._isUrlType = true;
            }
            newButtons.push(button);
        }
    });
    data.buttons = newButtons;
    data._linkBtnClass = 'js__growthmessage-dialog__button-link';
    data._closeBtnClass = 'js__growthmessage-dialog__button-close';
    return data;
};

class MessageStore extends Emitter {
    private register:Function;

    private _message:any = null;

    constructor(emitter) {
        super();
        this.register = emitter.on.bind(emitter);

        this.register('createMessage', (action) => {
            this._message = convert(action.data);
            this.emit('change');
        });

        this.register('closeMessage', (action) => {
            this._message = null;
            this.emit('change');
        });
    }

    getMessage():any {
        return this._message;
    }
}

export = MessageStore;