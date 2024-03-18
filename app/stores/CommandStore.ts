import Command from "../Command";
import BotClient from "../BotClient";
import Store from "./Store";

// Store for Commands
export default class CommandStore extends Store<string, Command> {

    public constructor (client: BotClient) {
        super(client);
    }


    // All keys are lowercase (resulting in case-insensitive keys)
    protected mapKey (raw: string): string {
        return raw.toLowerCase();
    }


    // Deletes command by given name and all other aliases
    public delete (key: string): boolean {
        const target = this.get(key);
        if (!target) return false;

        this.remove(target);
        return true;
    }


    // Adds command to Store
    public add (cmd: Command): void {
        this.set(cmd.name, cmd);
        if (cmd.aliases)
            cmd.aliases.forEach(alias => this.set(alias, cmd));
    }


    // Removes command by name and all aliases from Store
    public remove (cmd: Command): void {
        super.delete(cmd.name);
        if (cmd.aliases)
            cmd.aliases.forEach(alias => super.delete(alias));
    }


    // Loads command from absolute path
    public load (path: string): Command | undefined {
        try {
            const command = new (require(path).default)(this.client) as Command;
            delete require.cache[path];
            this.add(command);

            this.client.signale.info(`loaded command: '${command.name}'`);
            return command;
        } catch (err) {
            // @ts-ignore
            if (err.code && err.code === "MODULE_NOT_FOUND") {
                this.client.signale.error(`error loading command: could not find command at path: '${path}'`);
                return undefined;
            } else throw err;
        }
    }


    // Unloads and returns command
    public unload (name: string): Command | undefined {
        const target = this.get(name);
        if (!target) return undefined;

        this.remove(target);
        this.client.signale.info(`unloaded command: '${target.name}'`);
        return target;
    }


    // Reloads command from Store
    public reload (name: string): Command | undefined {
        const removed = this.unload(name);
        if (!removed) return undefined;

        return this.load(removed.filePath);
    }
}
