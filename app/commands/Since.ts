import Command from "../Command";
import BotClient from "../BotClient";
import { Message } from "discord.js";

export default class Since extends Command {
    public name: string = "since";


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [msgID, queryType] = args;
        const targetMsg = await message.channel.messages.fetch(msgID);
        if (!targetMsg) return Command.Utils.fail(message, "message does not exist");

        let lastSeen = message;
        let totalSeen = 0;
        let messages;

        //fetch 100 messages at a time until we get to BEFORE the target message's timestamp
        do {
            messages = await message.channel.messages.fetch({ limit: 100, before: lastSeen.id })
                .then(messages => messages.sort(
                    (earlierMessage, laterMessage) => earlierMessage.createdTimestamp - laterMessage.createdTimestamp)
                ).then(messages => messages);

            lastSeen = messages.last()!;
            if (lastSeen.createdTimestamp < targetMsg.createdTimestamp)
                totalSeen += 100;
            else break;
        } while (lastSeen.createdTimestamp < targetMsg.createdTimestamp);


        //binary search on messages' creation date to find target;...
        //finds earliest message at same creation date if target not in chunk (e.g. if multiple users send messages at same second)
        let min = 0;
        let max = messages.size - 1;
        let mid = Math.floor((min + max) / 2);

        while (min <= max) {
            if (messages.at(mid)!.id === targetMsg.id)
                break;
            else if (messages.at(mid)!.createdTimestamp >= targetMsg.createdTimestamp)
                max = mid - 1;
            else
                min = mid + 1;

            mid = Math.floor((min + max) / 2);
        }

        totalSeen += (messages.size - mid) + 1; //includes trigger and bot response
        return Command.Utils.success(message, `There were \`${totalSeen}\` messages since message ${msgID}`);
    }
}
