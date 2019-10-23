import Command from "../Command";
import BotClient from "../BotClient";

import { Message } from "discord.js";
import { MentionUtils, ParseUtils } from "../Utils";


export default class CopyEmoji extends Command {
    public name: string = "copyemoji";


    constructor (client: BotClient) {
        super(client);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [emoji_raw, name] = args;
        const id = ParseUtils.MATCH_EMOJI(emoji_raw);

        const emoji = await message.guild!.emojis.create("https://cdn.discordapp.com/emojis/" + id + ".png?v=1", name);
        const emojiMention = MentionUtils.MENTION_EMOJI(emoji);
        return Command.Utils.success(message, `Emoji \`${name}\` created (${emojiMention})`);
    }
}
