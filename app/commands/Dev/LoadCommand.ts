import Command from "../../Command";
import BotClient from "../../BotClient";

import { Message } from "discord.js";


export default class LoadCommand extends Command {
    public name: string = "loadcommand";


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [commandName] = args;

        return (this.client.commands.load(commandName))
            ? Command.Utils.success(message, `Successfully loaded command '${commandName}'`)
            : Command.Utils.fail(message, `Failed to load command '${commandName}': command does not exist`);
    }
}
