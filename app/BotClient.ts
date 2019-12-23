import Discord from "discord.js";
import Signale from "signale";
import { FileUtils } from "./Utils";

import { CommandStore } from "./stores";
import EventHandler from "./EventHandler";
import { BotConfig } from "../config";
import * as util from "./Utils";


export default class BotClient extends Discord.Client {
    public commands: CommandStore;
    public config: typeof BotConfig;
    public Utils: typeof util;
    public signale: Signale.Signale;


    public constructor (options?: Discord.ClientOptions) {
        super(options);
        this.config = BotConfig;
        this.Utils = util;
        this.commands = new CommandStore(this);

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

        const commandFiles = FileUtils.walkDir(__dirname + "/commands")
            .filter(f => f.endsWith(".js") || f.endsWith(".ts"));
        commandFiles.forEach(file => this.commands.load(file));

        this.signale.success("$ Finished loading commands.");
    }


    // Dynamically reads all events from ./events/ directory
    public async loadEvents () {
        this.signale.pending("$ Loading events...");

        const eventFiles = FileUtils.walkDir(__dirname + "/events")
            .filter(f => f.endsWith(".js") || f.endsWith(".ts"));
        for (const evtFile of eventFiles) {
            const event: EventHandler = new (require(evtFile).default)(this);
            this.on(event.name, (...args: any) => event.run(...args));

            this.signale.info(`loaded event: '${event.name}'`);
        }

        this.signale.success("$ Finished loading events.");
    }
}
