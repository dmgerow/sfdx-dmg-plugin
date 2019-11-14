import { SfdxCommand } from '@salesforce/command';
// import { Messages } from "@salesforce/core";

// Initialize Messages with the current plugin directory
// Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
// const messages = Messages.loadMessages("sfdx-dmg-plugin", "source");

export default class LimitsUsage extends SfdxCommand {
    public static description = "get current limits usage";

    public static examples = [];

    protected static requiresUsername = true;

    public static readonly flagsConfig = {};

    public async run(): Promise<any> {
        const org = this.org;
        const conn = org.getConnection();
        await org.refreshAuth();
        const theurl = `${conn.baseUrl()}/services/data/${conn.version}/limits/`;
        this.ux.log(theurl);
        const limitResult = <any>await conn.request({
            method: 'GET',
            url: theurl
        });
        this.ux.log(limitResult);
        return;
    }
}