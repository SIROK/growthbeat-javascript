import Emitter = require('component-emitter');

class Client extends Emitter {
    constructor() {
        super();
    }

    static load():Client {
        return new Client();
    }

    static create():Client {
        var client = new Client();
        return client;
    }

    static findById() {

    }
}

export = Client;