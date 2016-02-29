export class Dispatcher {
    constructor() {
        this.map = {};
    }

    register(name, handler) {
        this.map[name] = handler;
    }

    lookup(name) {
        return this.map[name];
    }
}
