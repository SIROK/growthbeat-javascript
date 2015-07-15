import MessageAction = require('../actions/message-action');
import MessageStore = require('../stores/message-store');
import t = require('t');

var templates = {
    plain: '/* TEMPLATE_DIALOG_PLAIN */',
    image: '/* TEMPLATE_DIALOG_IMAGE */'
};

interface Props {
    context: {
        messageAction:MessageAction;
        messageStore:MessageStore;
    };
    message:any;
}

class DialogView {
    el:any;
    parent:any = null;
    props:Props = null;

    constructor(parent, props) {
        this.parent = parent;
        this.props = props;
    }

    render() {
        if (this.el == null) {
            var html = new t(templates[this.props.message.type]).render(this.props.message);
            var div = document.createElement('div');
            div.innerHTML = html;
            this.el = div.firstChild;

            this.fitOverlay();
            this.fitDialog();

            this.parent.appendChild(this.el);
        }

        this.animateForOpen(100, () => {
            this.bindEvents();
        });
    }

    dispose() {
        this.animateForClose(100, () => {
            this.parent.removeChild(this.el);
            this.el = null;
        });
    }

    animateForOpen(delay:number, callback:Function) {
        setTimeout(() => {
            var el:any = this.el.getElementsByClassName('growthmessage-dialog__contents')[0];
            el.style['transform'] = 'scale(1)';
            el.style['-webkit-transform'] = 'scale(1)';
            this.el.style.opacity = 1;
            callback();
        }, delay);
    }

    animateForClose(delay:number, callback:Function) {
        setTimeout(() => {
            this.el.style.opacity = 0;
            callback();
        }, delay);
    }

    fitOverlay() {
        var D = document;
        this.el.width = Math.max(
            D.body.offsetWidth, D.documentElement.offsetWidth,
            D.body.clientWidth, D.documentElement.clientWidth
        );
        this.el.style.width = this.el.width + 'px';
        this.el.height = Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
        this.el.style.height = this.el.height + 'px';
    }

    fitDialog() {
        var D = document;
        var w = window.innerWidth
            || D.documentElement.clientWidth
            || D.body.clientWidth;

        var h = window.innerHeight
            || D.documentElement.clientHeight
            || D.body.clientHeight;
        var t = Math.max(window.pageYOffset, D.documentElement.scrollTop);
        var el:any = this.el.getElementsByClassName('growthmessage-dialog__inner')[0];
        el.width = w;
        el.style.width = w + 'px';
        el.height = h;
        el.style.height = h + 'px';
        el.top = t;
        el.style.top = t + 'px';
    }

    bindEvents() {
        var eventName = ('ontouchstart' in window) ? 'touchend' : 'click';
        this.el.addEventListener(eventName, (e) => {
            var isElement = this.hasClass(e.target, 'js__growthmessage-dialog__element-close');
            var isButton = this.hasClass(e.target, 'js__growthmessage-dialog__button-close');
            var isLink = this.hasClass(e.target, 'js__growthmessage-dialog__button-link');
            if (!isElement && !isButton && !isLink) return;

            this.props.context.messageAction.closeMessage();
        });
    }

    hasClass(el:any, name:string) {
        return (el.className.split(' ').indexOf(name) >= 0);
    }
}

export = DialogView;
