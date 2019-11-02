import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";


export default class ListCommands extends Command {
    public name: string = "listcommands";


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message) {
        let allCommands: string[] = [];
        this.client.commands.forEach(command => allCommands.push(command.name));

        return Command.Utils.success(message, (allCommands.length == 0)
            ? `There are no commands`
            : `Active commands:\n${allCommands.join("\n")}`);
    }
}
