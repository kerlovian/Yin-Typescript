import BotClient from "./BotClient";
import { Message } from "discord.js";


export default abstract class Command {
    public client: BotClient;
    public abstract name: string;
    public aliases?: string[];
    public argParser?: RegExp;

    protected constructor (client: BotClient) {
        this.client = client;
    }

    public abstract checkPermissions (message: Message): boolean;

    public abstract async run (message: Message, ...args: string[]): Promise<any>;
}
