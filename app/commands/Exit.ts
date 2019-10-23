import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";


export default class Exit extends Command {
    public name: string = "exit";
    public argParser: RegExp = /^\b$/; //matches none


    public constructor (client: BotClient) {
        super(client);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message) {
        await Command.Utils.success(message);
        this.client.destroy();
        this.client.signale.fav("CLIENT DESTROYED... Exiting program");
    }
}
