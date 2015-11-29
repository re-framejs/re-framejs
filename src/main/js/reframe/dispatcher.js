export class Dispatcher {
    constructor() {
        this.map = {};
    }

    register(name, handler) {
        if (this.map[name]) {
            throw new Error(name + 'handler is already registered');
        }
        this.map[name] = handler;
    }

    lookup(name) {
        return this.map[name];
    }
}
