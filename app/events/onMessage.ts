import EventHandler from "../EventHandler";
import BotClient from "../BotClient";

import { Message } from "discord.js";


export default class onMessage extends EventHandler {
    public name: string = "message";

    public constructor (client: BotClient) {
        super(client);
    }

    public async run (message: Message) {
        if (message.author!.bot) return;
        if (!message.content.startsWith(this.client.config.prefix)) return;


        const prefixRemoved = message.content.slice(this.client.config.prefix.length);
        const commandName = prefixRemoved.toLowerCase().match(/^\S+/)![0];

        const command = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName));
        if (!command) return;


        if (command.checkPermissions(message)) {
            const parser = command.argParser || /\S+/g;

            const args = prefixRemoved.slice(commandName.length).trim().match(parser);
            command.run(message, args || []);
        }
    }
}
