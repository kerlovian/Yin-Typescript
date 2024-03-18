import EventHandler from "../EventHandler";
import BotClient from "../BotClient";
import {InviteInterceptConfig, InviteInterceptConfigType, InviteInterceptServerConfig} from "../../config";

import {CategoryChannel, Events, GuildTextBasedChannel, Invite, Message} from "discord.js";

// @ts-ignore
const TypedInterceptConfig = InviteInterceptConfig as InviteInterceptConfigType;


/**
 * Handles messageCreate api events
 */
export default class onMessage extends EventHandler {
    public name = Events.MessageCreate;

    public constructor (client: BotClient) {
        super(client);
    }


    /**
     * If the message content/context matches criteria, it will be processed as an invite interception or a command
     * @param message the message that was just created, as sent by the api (note: this can be either from a guild or dm)
     */
    public async run (message: Message) {
        //invite interception (only happens in servers)
        if(message.inGuild()) {
            //matches the invite code (after the d.gg/), or null if no invite
            let inviteCodes = Invite.InvitesPattern.exec(message.content);

            //if invite link in the message, and this server is subject to invite interception, then attempt intercept
            let intercepted = false;
            if (inviteCodes && TypedInterceptConfig.hasOwnProperty(message.guildId))
                intercepted = await this.interceptInvite(message, inviteCodes);

            //if this message is an invite and is not permitted, then do not handle it as a command
            if(intercepted)
                return;
        }

        //if not a bot message, and starts with the command prefix, then handle as command
        if(!message.author.bot && message.content.startsWith(this.client.config.prefix))
            this.handleCommand(message);
    }


    /**
     * Attempts to intercept the invite message.
     * preconditions: this message is in a guild that has invite interception enabled, and it has an invite in it.
     * @param message the message with the invite to be intercepted (note: this can only be from a guild)
     * @param inviteCodes RegExp.exec() return result that includes the invite link group
     * @private
     * @returns whether interception rules were applied or not (the message may be permitted based on config)
     */
    private async interceptInvite(message: Message, inviteCodes: RegExpExecArray): Promise<boolean> {
        //read context information from message
        const sendingMember = message.member!;                           //the guild member who sent invite
        const channel = message.channel as GuildTextBasedChannel;        //the guild channel where invite was sent
        const category = channel.parent as CategoryChannel | null;       //the category (or null if none) that channel is under
        const hasAdmin = sendingMember.permissions.has("Administrator"); //whether sending member has admin perms
        const isBot = message.author.bot;                                //whether sending member is a bot

        //read configuration for this server
        const interceptConfig = TypedInterceptConfig[message.guildId!];
        const permUsers = interceptConfig.permittedUserIDs;
        const permChannels = interceptConfig.permittedChannelIDs;
        const permCategories = interceptConfig.permittedCategoryIDs;
        const permAdmin = interceptConfig.permitUsersWithAdmin;
        const permBot = interceptConfig.permitBots;

        //simple tests for if invite is permitted
        if ((permUsers && permUsers.includes(sendingMember.id))                     //tests user permitted
            || (permChannels && permChannels.includes(channel.id))                  //tests channel permitted
            || (category && permCategories && permCategories.includes(category.id)) //tests category permitted
            || (hasAdmin && permAdmin)                                              //tests admins permitted
            || (isBot && permBot)                                                   //tests bots permitted
        ) {
            return false; //exit interception if invite is permitted
        }

        //if config dictates roles that are allowed to send invites, then check if the member has those roles
        const permRoles = interceptConfig.permittedRoleIDs;
        if (permRoles) {
            const userRoles = sendingMember.roles.valueOf();
            const atLeastOneRolePermitted = userRoles.some((role) => (permRoles.includes(role.id)));

            //if member has at least one permitted role, then exit interception
            if(atLeastOneRolePermitted)
                return false;
        }

        //if config dictates that invites to this same server are allowed, then check if the invite goes to this server
        const permThisServer = interceptConfig.permitThisServer;
        if(permThisServer) {
            const thisServerInvites = await message.guild!.invites.fetch();
            const inviteCode = inviteCodes.groups!["code"];
            const isThisServer = thisServerInvites.some((invite) =>  (invite.code === inviteCode));

            //if invite points to this same server, then exit interception
            if(isThisServer)
                return false;
        }


        await channel.send("That invite link did not meet permitted standards");
        return true;
    }

    /**
     * Attempts to run a command from this message.
     * preconditions: this message began with the command prefix and was not sent by a bot
     * @param message the message that triggered the event (note: this can be either from a guild or dm)
     * @private
     */
    private async handleCommand(message: Message) {
        this.client.signale.log(`reacting to '${message.content}'`);

        //message content, with command prefix removed
        const prefixRemoved = message.content.slice(this.client.config.prefix.length);

        //finds command name (next full word)
        const commandName = prefixRemoved.toLowerCase().match(/^\S+/)![0];

        //resolve stored command object
        const command = this.client.commands.get(commandName);
        if (!command) return;

        //if context allows usage of command, then parse args and run the command
        if (command.checkPermissions(message)) {
            //parse args following the command name according to command's regex, or full words if no regex defined
            const parser = command.argParser || /\S+/g;
            const args = prefixRemoved.slice(commandName.length).trim().match(parser);

            this.client.signale.log(`running command '$'{command.name}' with args: ${(args || ["(no args)"]).toString()}`);
            command.run(message, args || []);
        }
    }
}

