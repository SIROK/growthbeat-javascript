import Emitter = require('component-emitter');
import t = require('t');

var templates = {
    plain: '/* TEMPLATE_DIALOG_PLAIN */',
    image: '/* TEMPLATE_DIALOG_IMAGE */'
};

class Dialog extends Emitter {
    private el:any;
    private parentElement:any;

    constructor() {
        super();
    }

    open(data:{type:string}) {
        this.parentElement = document.body.getElementsByClassName('growthmessage')[0];
        this.render(data);
        this.setElement();
        this.fitOverlay();
        this.fitDialog();
        //this.scaleDialog();
        this.bindEvents();
        this.animateForOpen(100);
    }

    hide(delay:number = 0) {
        setTimeout(()=> {
            this.parentElement.innerHTML = '';
        }, delay);
    }

    render(data:{type:string}) {
        var html = new t(templates[data.type]).render(this.filter(data));
        this.parentElement.innerHTML = html;
    }

    filter(data:any):{} {
        var newButtons = [];
        data.buttons.forEach((button:any, index)=> {
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
    }

    setElement() {
        this.el = document.body.getElementsByClassName('growthmessage-dialog')[0];
    }

    animateForOpen(delay:number = 0) {
        setTimeout(()=> {
            var el:any = document.body.getElementsByClassName('growthmessage-dialog__contents')[0];
            el.style['transform'] = 'scale(1)';
            el.style['-webkit-transform'] = 'scale(1)';
            this.el.style.opacity = 1;
        }, delay);
    }

    animateForClose(delay:number = 0) {
        setTimeout(()=> {
            this.el.style.opacity = 0;
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
        var el:any = document.body.getElementsByClassName('growthmessage-dialog__inner')[0];
        el.width = Math.max(
            D.body.clientWidth, D.documentElement.clientWidth
        );
        el.style.width = el.style.width + 'px';
        el.height = Math.min(
            D.body.clientHeight, D.documentElement.clientHeight
        );
        el.style.height = el.height + 'px';
        el.top = Math.max(window.pageYOffset, D.documentElement.scrollTop);
        el.style.top = el.top + 'px';
    }

    scaleDialog() {
        var el:any = document.body.getElementsByClassName('growthmessage-dialog__inner')[0];
        setTimeout(()=> {
            var D = document;
            var height = Math.min(
                D.body.clientHeight, D.documentElement.clientHeight
            );
            if (el.offsetHeight <= height) return;
            el.style.transform = 'scale(' + (height / el.offsetHeight * 0.85) + ')';
            el.style.transformOrigin = 'center top';
            el.style.top = el.top + height * 0.075 + 'px';
        }, 100);
    }

    bindEvents() {
        var eventName = ('ontouchstart' in window) ? 'touchend' : 'click';
        this.el.addEventListener(eventName, (e)=> {
            var isElement = this.hasClass(e.target, 'js__growthmessage-dialog__element-close');
            var isButton = this.hasClass(e.target, 'js__growthmessage-dialog__button-close');
            var isLink = this.hasClass(e.target, 'js__growthmessage-dialog__button-link');
            if (!isElement && !isButton && !isLink) return;
            this.animateForClose(isLink ? 600 : 0);
            this.hide(isLink ? 1000 : 300);
        });
    }

    hasClass(el:any, name:string) {
        return (el.className.split(' ').indexOf(name) >= 0);
    }
}

export = Dialog;

