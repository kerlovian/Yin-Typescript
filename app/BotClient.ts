import Discord from "discord.js";
import Signale from "signale";
import fs from "fs-extra";

import Command from "./Command";
import EventHandler from "./EventHandler";
import { BotConfig } from "../config";
import * as util from "./Utils";


export default class BotClient extends Discord.Client {
    public commands: Map<string | undefined, Command>;
    public aliases: Map<string | undefined, string>;
    public config: typeof BotConfig;
    public Utils: typeof util;
    public signale: Signale.Signale;


    public constructor (options?: Discord.ClientOptions) {
        super(options);
        this.config = BotConfig;
        this.Utils = util;

        this.commands = new Map();
        this.aliases = new Map();

        this.signale = Signale;
        this.signale.config({
            displayFilename: true,
            displayTimestamp: true,
            displayDate: true,
        });
    }


    // Loads all commands and events then logs in
    public async init () {
        this.signale.time("Initialization");

        await this.loadCommands();
        await this.loadEvents();
        await this.login(this.config.token);

        this.signale.timeEnd("Initialization");
    }


    // Dynamically reads all commands from ./commands/ directory
    public async loadCommands () {
        this.signale.pending("$ Loading commands...");

        const commandFiles = await fs.readdir(__dirname + "/commands");
        for (const cmdFile of commandFiles) {
            const command: Command = new (require(__dirname + `/commands/${cmdFile}`).default)(this);

            this.commands.set(command.name, command);
            if (command.aliases) {
                for (const alias of command.aliases) {
                    this.aliases.set(alias, command.name);
                }
            }

            this.signale.info(`loaded command: '${command.name}'`);
        }

        this.signale.success("$ Finished loading commands.");
    }


    // Dynamically reads all events from ./events/ directory
    public async loadEvents () {
        this.signale.pending("$ Loading events...");

        const eventFiles = await fs.readdir(__dirname + "/events");
        for (const evtFile of eventFiles) {
            const event: EventHandler = new (require(__dirname + `/events/${evtFile}`).default)(this);
            this.on(event.name, (...args: any) => event.run(...args));

            this.signale.info(`loaded event: '${event.name}'`);
        }

        this.signale.success("$ Finished loading events.");
    }
}
