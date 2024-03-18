import * as BotConfig from "./bot-config.json";
import * as InviteInterceptConfig from "./invite-intercept-config.json";

interface InviteInterceptConfigType {
    [key: string]: InviteInterceptServerConfig;
}

interface InviteInterceptServerConfig {
    permittedRoleIDs: string[] | undefined,
    permittedUserIDs: string[] | undefined,
    permittedCategoryIDs: string[] | undefined,
    permittedChannelIDs: string[] | undefined,
    permitThisServer: boolean | undefined,
    permitUsersWithAdmin: boolean | undefined,
    permitBots: boolean | undefined,
    logChannels: string[] | undefined,
    askBeforeBan: boolean,
    askChannel: string | undefined,
    allowAskDenyingSelf: boolean | undefined,
    muteDuringAsk: boolean | undefined,
    muteRoleID: string | undefined,
    decisionMakerRoleIDs: string[] | undefined,
    decisionMakeUserIDs: string[] | undefined
}

export {
    BotConfig, InviteInterceptConfig, InviteInterceptConfigType, InviteInterceptServerConfig
}
