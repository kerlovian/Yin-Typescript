import BotClient from "../BotClient";

// Acts like a Map<K,V> but removes set(), replacing with add() and remove() functionality
// Also adds dynamic load(), unload(), and reload() functionality
export default abstract class Store<K, V> {
    private internal: Map<K, V>;
    protected client: BotClient;

    protected constructor (client: BotClient) {
        this.client = client;
        this.internal = new Map<K, V>();
    }


    // Allows translation between given keys and internally used keys (ex. string -> lower case)
    protected mapKey (raw: K) {
        return raw;
    }


    // Finds key of given value and adds to Store
    public abstract add (val: V): void;


    // Finds and removes all keys of given value from Store
    public abstract remove (val: V): void;

    // Loads a value at given path and adds to proper key
    public abstract load (path: string): V | undefined;


    // Removes and returns value at key
    public abstract unload (key: K): V | undefined;


    // Removes and reloads value at key from STore
    public abstract reload (key: K): V | undefined;


    //exposes Map functionality
    public clear () {
        this.internal.clear();
    }
    public delete (key: K) {
        return this.internal.delete(this.mapKey(key));
    }
    public forEach (callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        return this.internal.forEach(callbackfn, thisArg);
    }
    public get (key: K) {
        return this.internal.get(this.mapKey(key));
    }
    public has (key: K) {
        return this.internal.has(this.mapKey(key));
    }
    public get size () {
        return this.internal.size;
    }


    //exposed to only subclasses
    protected set (key: K, val: V) {
        this.internal.set(this.mapKey(key), val);
        return this;
    }
}
