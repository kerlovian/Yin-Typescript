export default abstract class ParseUtils {
    //matches emoji ID from raw emoji mention (string) or just the ID by itself
    public static readonly EMOJI_REGEXP = /(?:(?:<:\w{2,32}:)(\d{17,19})(?:>))|(\d{17,19})/g;

    public static MATCH_EMOJI (raw: string): string {
        const match = raw.match(this.EMOJI_REGEXP)!;
        return match[0];
    }



    //matches user ID from raw user mention (string) or just the ID by itself
    public static readonly USER_REGEXP = /(?:<@!?(\d{17,19})>)|(\d{17,19})/g;

    public static MATCH_USER (raw: string): string {
        const match = raw.match(this.USER_REGEXP)!;
        return match[0];
    }



    //matches role ID from raw role mention (string) or just the ID by itself
    public static readonly ROLE_REGEXP = /(?:<@&(\d{17,19})>)|(\d{17,19})/g;

    public static MATCH_ROLE (raw: string): string {
        const match = raw.match(this.ROLE_REGEXP)!;
        return match[0];
    }



    //matches channel ID from raw channel mention (string) or just the ID by itself
    public static readonly CHANNEL_REGEXP = /(?:<#(\d{17,19})>)|(\d{17,19})/g;

    public static MATCH_CHANNEL (raw: string): string {
        const match = raw.match(this.CHANNEL_REGEXP)!;
        return match[0];
    }
}
