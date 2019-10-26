export default abstract class ParseUtils {
    //matches emoji ID from raw emoji mention (string) or just the ID by itself
    public static readonly EMOJI_REGEXP = /(?:(?:<:\w{2,32}:)(?<fromMention>\d{17,19})(?:>))|(?<byItself>\d{17,19})/g;

    public static MATCH_EMOJI (raw: string): string {
        this.EMOJI_REGEXP.lastIndex = 0; //prevents successive matching
        const match = this.EMOJI_REGEXP.exec(raw)!.groups!;
        return match["fromMention"] || match["byItself"];
    }



    //matches user ID from raw user mention (string) or just the ID by itself
    public static readonly USER_REGEXP = /(?:<@!?(?<fromMention>\d{17,19})>)|(?<byItself>\d{17,19})/g;

    public static MATCH_USER (raw: string): string {
        this.USER_REGEXP.lastIndex = 0; //prevents successive matching
        const match = this.USER_REGEXP.exec(raw)!.groups!;
        return match["fromMention"] || match["byItself"];
    }



    //matches role ID from raw role mention (string) or just the ID by itself
    public static readonly ROLE_REGEXP = /(?:<@&(?<fromMention>\d{17,19})>)|(?<byItself>\d{17,19})/g;

    public static MATCH_ROLE (raw: string): string {
        this.ROLE_REGEXP.lastIndex = 0; //prevents successive matching
        const match = this.ROLE_REGEXP.exec(raw)!.groups!;
        return match["fromMention"] || match["byItself"];
    }



    //matches channel ID from raw channel mention (string) or just the ID by itself
    public static readonly CHANNEL_REGEXP = /(?:<#(?<fromMention>\d{17,19})>)|(?<byItself>\d{17,19})/g;

    public static MATCH_CHANNEL (raw: string): string {
        this.CHANNEL_REGEXP.lastIndex = 0; //prevents successive matching
        const match = this.CHANNEL_REGEXP.exec(raw)!.groups!;
        return match["fromMention"] || match["byItself"];
    }
}
