import Command from "../../Command";
import BotClient from "../../BotClient";

import { Message } from "discord.js";


export default class Eval extends Command {
    public name: string = "eval";
    public argParser: RegExp = /[\s\S]*/; //matches all


    public constructor (client: BotClient) {
        super(client, __filename);
    }

    public checkPermissions (message: Message): boolean {
        return message.author!.id === this.client.config.ownerID;
    }

    public async run (message: Message, args: string[]) {
        const [code] = args;

        try {
            Eval.createFunction(code)(message, this.client);
        } catch (err) {
            message.channel.send("2. External error during evaluation: " + err);
        }
    }


    private static createFunction (code: string): Function {
        return new Function(Eval.wrap(code))();
    }

    private static wrap (code: string): string {
        return '' +
            '"use strict";\n' +
            'console.log("hello from inside eval function");\n' +
            'return(\n' +
            '    async (message, client) => {\n' +
            '        try {' +
            `\n${code}\n` +
            '        } catch (err) {\n' +
            '            console.log(err);\n' +
            '            message.channel.send("1. Internal error during evaluation: " + err);\n' +
            '        }\n' +
            '    }\n' +
            ');\n';
    }
}
