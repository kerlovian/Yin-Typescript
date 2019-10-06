import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";


export default class CopyChannel extends Command {
    public name: string = "copychannel";


    public constructor (client: BotClient) {
        super(client);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [baseChannel, AS, type, TO, ...name] = args;

        const ch = message.guild!.channels.resolve(baseChannel);
        if (!ch) return Command.fail(message, "base channel not found");

        if (!type || !["category", "text", "voice"].includes(type)) return Command.fail(message, "invalid channel type");
        if (!name) return Command.fail(message, "no specified name");

        const perms = ch.permissionOverwrites;
        const createdChannel = await message.guild!.channels.create(name.join(" "), {
            type: type as "category" || "text" || "voice",
            permissionOverwrites: perms
        });

        const createdChannelMention = (type === "text")
            ? `<#${createdChannel.id}>`
            : createdChannel.name;
        const createdChannelType = type.slice(0, 1).toUpperCase() + type.slice(1) + "Channel";

        return Command.success(message, `${createdChannelType} ${createdChannelMention} created`);
    }
}
