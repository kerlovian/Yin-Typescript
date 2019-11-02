import Command from "../Command";
import BotClient from "../BotClient";


//acts like a Map<string, Command | undefined> where key can be either primary name OR alias;
//however, set(key, Command) functionality is replaced by add(Command) to accommodate aliases
export default class CommandStore {
    private commands: Map<string | undefined, Command>;
    private aliases: Map<string, string>;
    private client: BotClient;


    public constructor (client: BotClient) {
        this.client = client;
        this.commands = new Map<string, Command>();
        this.aliases = new Map<string, string>();
    }


    // Deletes all Commands and aliases from the store
    // - acts like a Map
    public clear () {
        this.commands.clear();
        this.aliases.clear();
    }

    // Deletes the Command and all of its aliases;
    // - acts like a Map
    public delete (name: string): boolean {
        const command = this.get(name);
        if (!command) return false;

        //deletes any aliases
        if (command.aliases)
            command.aliases.forEach(alias => this.aliases.delete(alias));

        return this.commands.delete(command.name);
    }

    // Gets Command by either primary name or an alias;
    // - acts like a Map
    public get (name: string): Command | undefined {
        return this.commands.get(this.getPrimaryName(name));
    }

    // Checks if the Command exists by either primary name or an alias
    // - acts like a Map
    public has (name: string): boolean {
        return this.commands.has(name) || this.aliases.has(name);
    }

    // Returns total number of unique commands in this store
    // - acts like a Map
    public get size () {
        return this.commands.size;
    }


    // Reflects other standard Map functionality onto the <primary name, Command> Map
    public forEach = (callbackfn: (value: Command, key: string | undefined, map: Map<string | undefined, Command>) => void, thisArg?: any) =>
        this.commands.forEach(callbackfn, thisArg);
    public keys = () => this.commands.keys();
    public values = () => this.commands.values();
    public entries = () => this.commands.entries();


    // Returns the primary name of the given command
    private getPrimaryName (name: string): string | undefined {
        name = name.toLowerCase();
        return (this.commands.has(name))
            ? name
            : this.aliases.get(name);
    }


    // Adds Command (through both its primary name and aliases) to internal maps
    public add (command: Command) {
        const name = command.name.toLowerCase();
        this.commands.set(name, command);

        //adds any aliases
        if (command.aliases)
            command.aliases.forEach(alias => this.aliases.set(alias.toLowerCase(), name));
    }

    // Loads Command from standard commands directory: ~/app/commands/`commandName`
    public load (name: string): Command | undefined {
        const loc = require.resolve(`../commands/${name}`);
        return this.loadPath(loc);
    }

    // Loads Command from fully qualified path
    private loadPath (path: string): Command | undefined {
        try {
            const command = new (require(path).default)(this.client) as Command;
            delete require.cache[path];
            this.add(command);

            this.client.signale.info(`loaded command: '${command.name}'`);
            return command;
        } catch (err) {
            if (err.code && err.code === "MODULE_NOT_FOUND") {
                this.client.signale.error(`error loading command: could not find command at path: '${path}'`);
                return undefined;
            } else throw err;
        }
    }

    // Removes Command from store
    public unload (name: string): Command | undefined {
        const command = this.get(name);
        if (!command) return undefined;

        this.delete(command.name);

        this.client.signale.info(`unloaded command: '${command.name}'`);
        return command;
    }

    // Reloads Command from store
    public reload (name: string): Command | undefined {
        const removed = this.unload(name);
        if (!removed) return undefined;

        return this.loadPath(removed.filePath);
    }
}
