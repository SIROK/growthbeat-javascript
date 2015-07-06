import Dialog = require('./dialog');

var styles = '/* STYLES */';

class MessageView {
    private el:HTMLDivElement = null;

    constructor() {
        console.log('messageview');
        this.render();
        this.setStyles();
    }

    render() {
        var el = document.createElement('div');
        el.className = 'growthmessage';
        document.body.appendChild(el);
        this.el = el;
    }

    setStyles() {
        var el:HTMLStyleElement = document.createElement('style');
        el.type = 'text/css';
        el.innerHTML = styles;
        document.getElementsByTagName('head')[0].appendChild(el);
    }

    handleEvents() {

    }

    open(data) {
        var dialog = new Dialog();
    }
}

export = MessageView;
