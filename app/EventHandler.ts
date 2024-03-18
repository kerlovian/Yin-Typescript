import BotClient from "./BotClient";


export default abstract class EventHandler {
    public client: BotClient;
    public abstract name: string;

    protected constructor (client: BotClient) {
        this.client = client;
    }

    // @ts-ignore
    public abstract async run (...args: any): Promise<any>;
}
