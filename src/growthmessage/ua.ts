var ua = window.navigator.userAgent.toLowerCase();
var is = (text:string):boolean => {
    return ua.indexOf(text) !== -1;
};

export function isViewable():boolean {
    return (
        is('iphone os 6_') ||
        is('iphone os 7_') ||
        is('iphone os 8_') ||
        is('iphone os 9_') ||
        is('iphone os 10_') ||
        (is('android 4.') && is('mobile safari')) ||
        (is('android 5.') && is('mobile safari')) ||
        (is('android 6.') && is('mobile safari'))
    );
}
