import EventHandler from "../EventHandler";
import BotClient from "../BotClient";
import { Events } from "discord.js";


export default class onReady extends EventHandler {
    public name = Events.ClientReady;

    public constructor (client: BotClient) {
        super(client);
    }

    public async run () {
        const user = await this.client.users.fetch(this.client.config.ownerID);
        user.send(`new instance ${new Date()}`);

        this.client.signale.fav("CLIENT READY");
    }
}
