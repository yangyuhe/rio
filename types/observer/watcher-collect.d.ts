import { Watcher } from "./watcher";
export declare class WatcherCollecter {
    private key;
    private watches;
    constructor(key: string);
    GetKey(): string;
    AddTarget(watcher: Watcher): void;
    Notify(): void;
}
