var styles = '/* STYLES */';

class MessageView {
    //private el:HTMLElement = null;

    constructor() {
        console.log('messageview');
    }

    render() {
        var el = document.createElement('div');
        el.className = 'growthmessage';
        document.body.appendChild(el);
        //this.el = document.body.getElementsByClassName(el.className)[0];
    }

    setStyles() {
        //var el:HTMLElement = document.createElement('style');
        //el.type = 'text/css';
        //el.innerHTML = styles;
        //document.getElementsByTagName('head')[0].appendChild(el);
    }
}

export = MessageView;
