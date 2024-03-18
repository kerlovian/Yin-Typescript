import BotClient from "./BotClient";
import { Message } from "discord.js";

import { CommandUtils } from "./Utils";


export default abstract class Command {
    public client: BotClient;
    public readonly filePath: string;
    public abstract name: string;
    public aliases?: string[];
    public argParser?: RegExp;


    protected constructor (client: BotClient, filePath: string) {
        this.client = client;
        this.filePath = filePath;
    }

    public abstract checkPermissions (message: Message): boolean;

    // @ts-ignore
    public abstract async run (message: Message, args: string[]): Promise<any>;

    protected static Utils = CommandUtils;
}
