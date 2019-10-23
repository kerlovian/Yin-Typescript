import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";
import { MentionUtils, ParseUtils } from "../Utils";


export default class CopyChannel extends Command {
    public name: string = "copychannel";


    public constructor (client: BotClient) {
        super(client);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [baseChannel_raw, AS, type, TO, ...name] = args;
        const baseChannel = ParseUtils.MATCH_CHANNEL(baseChannel_raw);

        const ch = message.guild!.channels.resolve(baseChannel);
        if (!ch) return Command.Utils.fail(message, "base channel not found");

        if (!type || !["category", "text", "voice"].includes(type)) return Command.Utils.fail(message, "invalid channel type");
        if (!name) return Command.Utils.fail(message, "no specified name");

        const perms = ch.permissionOverwrites;
        const createdChannel = await message.guild!.channels.create(name.join(" "), {
            type: type as "category" || "text" || "voice",
            permissionOverwrites: perms
        });

        const createdChannelMention = MentionUtils.MENTION_CHANNEL(createdChannel);
        const createdChannelType = type.slice(0, 1).toUpperCase() + type.slice(1) + "Channel";

        return Command.Utils.success(message, `${createdChannelType} ${createdChannelMention} created`);
    }
}
