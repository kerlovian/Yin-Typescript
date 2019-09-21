export const BotConfig: BotConfigTyping = require("./bot-config.json");

interface BotConfigTyping {
    token: string,
    ownerID: string,
    prefix: string,
    channels: {
        logs: string,
        errors: string,
    },
}
