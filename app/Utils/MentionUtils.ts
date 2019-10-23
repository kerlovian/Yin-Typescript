import { Channel, DMChannel, GuildEmoji, GuildMember, Role, User, VoiceChannel } from "discord.js";


export default abstract class MentionUtils {
    //constructs raw emoji mention (string) from GuildEmoji
    public static MENTION_EMOJI (emoji: GuildEmoji): string {
        return (emoji.available)
            ? `<:${emoji.name}:${emoji.id}>`
            : emoji.name;
    }

    //constructs raw user mention (string) from User or GuildMember
    public static MENTION_USER (user: User | GuildMember): string {
        return `<@${user.id}>`;
    }

    //constructs raw role mention (string) from Role
    public static MENTION_ROLE (role: Role): string {
        return (role.mentionable)
            ? `<@&${role.id}>`
            : role.name;
    }

    //constructs raw channel mention (string) from Channel
    public static MENTION_CHANNEL (channel: Channel): string {
        switch (channel.type) {
            case "text":
                return `<#${channel.id}>`;
            case "category":
            case "voice":
                return (channel as VoiceChannel).name;
            case "dm":
                return (channel as DMChannel).recipient.tag;
            default:
                return channel.id;
        }
    }
}
