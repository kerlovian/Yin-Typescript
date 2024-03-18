import Command from "../Command";
import BotClient from "../BotClient";

import {CategoryChannel, GuildChannelTypes, Message, TextChannel, VoiceChannel} from "discord.js";
import { ChannelType } from "discord-api-types/v10";
import { MentionUtils, ParseUtils } from "../Utils";


export default class CopyChannel extends Command {
    public name: string = "copychannel";


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [baseChannel_raw, AS, type, TO, ...name] = args;
        const baseChannel = ParseUtils.MATCH_CHANNEL(baseChannel_raw);

        const ch = message.guild!.channels.resolve(baseChannel) as CategoryChannel | TextChannel | VoiceChannel;
        if (!ch) return Command.Utils.fail(message, "base channel not found");

        if (!type || !["category", "text", "voice"].includes(type)) return Command.Utils.fail(message, "invalid channel type");
        if (!name) return Command.Utils.fail(message, "no specified name");

        let typeEnum;
        switch(type) {
            case "category":
                typeEnum = ChannelType.GuildCategory;
                break;
            case "text":
                typeEnum = ChannelType.GuildText;
                break;
            case "voice":
                typeEnum = ChannelType.GuildVoice;
                break;
        }
        typeEnum = typeEnum as GuildChannelTypes;


        const perms = ch.permissionOverwrites.valueOf();
        const createdChannel = await message.guild!.channels.create({
            name: name.join(" "),
            type: typeEnum,
            permissionOverwrites: perms
        });

        const createdChannelMention = MentionUtils.MENTION_CHANNEL(createdChannel);
        const createdChannelType = type.charAt(0).toUpperCase() + type.slice(1) + "Channel";

        return Command.Utils.success(message, `${createdChannelType} ${createdChannelMention} created`);
    }
}
