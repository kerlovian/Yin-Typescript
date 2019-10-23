import { Message } from "discord.js";


export default abstract class CommandUtils {
    public static async success (message: Message, response?: any) {
        await message.react("✅");
        if (response) await message.channel.send(response);
    }

    public static async fail (message: Message, response?: any) {
        await message.react("❌");
        if (response) await message.channel.send(response);
    }
};
