type EventEmitterCallback = (...args: Array<any>) => void | Promise<void>;

type EventEmitterEvents = {
    [key: string]: Array<EventEmitterCallback>;
}

class EventEmitter {
    events: EventEmitterEvents;

    constructor() {
        this.events = {};
    }

    private has(event: string) {
        return this.events.hasOwnProperty(event);
    }

    private get(event: string) {
        return this.has(event) ? this.events[event] : undefined;
    }

    public on(event: string, callback: EventEmitterCallback) {
        if (this.has(event)) {
            this.events[event].push(callback);
        } else {
            this.events[event] = [callback];
        }
    }

    public off(event: string, callback?: EventEmitterCallback) {
        if (this.has(event)) {
            if (callback) {
                this.events[event] = this.events[event].filter(c => c !== callback);
            } else {
                delete this.events[event];
            }
        }
    }

    protected async emit(event: string, ...args: Array<any>) {
        const callbacks = this.get(event);

        if (callbacks) {
            for (const callback of callbacks) {
                await callback.apply(null, args);
            }
        }
    }
}

export default EventEmitter;