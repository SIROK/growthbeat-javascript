module GrowthMessage {
    class Module {
        exports(name:string, src:string) {
            this[name] = src;
        }
        require(name:string) {
            return this[name];
        }
    }
    export var module = new Module();
}
