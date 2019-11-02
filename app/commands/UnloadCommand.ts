import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";


export default class UnloadCommand extends Command {
    public name: string = "unloadcommand";


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [commandName] = args;

        return (this.client.commands.unload(commandName))
            ? Command.Utils.success(message, `Successfully unloaded command '${commandName}'`)
            : Command.Utils.fail(message, `Failed to unload command '${commandName}': command not found`);
    }
}
