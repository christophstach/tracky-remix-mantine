import { createContext } from 'react';


export class SyncedTimer {
    private _counter: number = 0;
    private _interval;
    private _callbacks: Record<number, () => void> = {};

    constructor(intervalMs: number = 1000) {
        this._interval = setInterval(() => {
            this.tick();
        }, intervalMs);
    }

    public subscribe(callback: () => void) {
        this._callbacks[this._counter] = callback;
        const identifier = this._counter.valueOf();

        const unsubscribe = () => {
            delete this._callbacks[identifier];
        };

        this._counter++;

        return { unsubscribe };
    }

    public trigger() {
        this.tick();
    }

    private tick() {
        Object.values(this._callbacks).forEach(callback => callback());
    }
}

export const SyncedTimerContext = createContext(new SyncedTimer());
