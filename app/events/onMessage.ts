import EventHandler from "../EventHandler";
import BotClient from "../BotClient";

import { Events, Message } from "discord.js";


export default class onMessage extends EventHandler {
    public name = Events.MessageCreate;

    public constructor (client: BotClient) {
        super(client);
    }

    public async run (message: Message) {
        if (message.author!.bot) return;
        if (!message.content.startsWith(this.client.config.prefix)) return;
        this.client.signale.log(`reacting to '${message.content}'`);


        const prefixRemoved = message.content.slice(this.client.config.prefix.length);
        const commandName = prefixRemoved.toLowerCase().match(/^\S+/)![0];

        const command = this.client.commands.get(commandName);
        if (!command) return;


        if (command.checkPermissions(message)) {
            const parser = command.argParser || /\S+/g;

            const args = prefixRemoved.slice(commandName.length).trim().match(parser);
            this.client.signale.log(`running command '$'{command.name}' with args: ${(args || ["(no args)"]).toString()}`);
            command.run(message, args || []);
        }
    }
}
