import MicroEvent = require('microevent');

class Client extends MicroEvent {
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