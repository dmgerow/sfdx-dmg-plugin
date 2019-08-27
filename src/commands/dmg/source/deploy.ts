// Credit sfdx-waw-plugin for base code https://github.com/wadewegner/sfdx-waw-plugin
import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { JsonMap } from "@salesforce/ts-types";
import fs = require('fs-extra');
import { getParsed } from '../../../lib/xml2jsAsync';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "source");

export default class SourceDeploy extends SfdxCommand {
    public static description = messages.getMessage("deploy.description");
    public static examples = [];

    public static readonly flagsConfig = {
        manifest: flags.string({
            char: "x",
            description: messages.getMessage("deploy.flags.manifest"),
            required: true
        })
    };

    protected static requiresUsername = true;

    public async run(): Promise<JsonMap> {
        const manifest = this.flags.manifest;
        const fieldJSON = <any>(
            await getParsed(await fs.readFile(manifest))
        );
        this.ux.styledJSON(fieldJSON);
        return fieldJSON;
    }

}
