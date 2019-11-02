import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";


export default class ReloadCommand extends Command {
    public name: string = "reloadcommand";


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [commandName] = args;

        return (this.client.commands.reload(commandName))
            ? Command.Utils.success(message, `Successfully reloaded command '${commandName}'`)
            : Command.Utils.fail(message, `Failed to reload command '${commandName}': command not found`);
    }
}
