import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from "@salesforce/core";
import fs = require('fs-extra');
import { exec } from '../../../lib/execProm';
import { join } from 'path';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "source");

export default class Retrieve extends SfdxCommand {
    public static description = messages.getMessage("retrieve.description");

    public static examples = [];

    protected static requiresUsername = true;

    public static readonly flagsConfig = {
        manifest: flags.string({
            char: "x",
            description: messages.getMessage("retrieve.flags.manifest"),
            required: true
        }),
        nocleandirectory: flags.boolean({
            char: "n",
            description: messages.getMessage("retrieve.flags.nocleandirectory")
        })
    };

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const targetusername = this.org.getUsername();
        const manifest = this.flags.manifest;
        const nocleandirectory = this.flags.nocleandirectory;

        fs.ensureDirSync(join(this.project.getPath(), 'main', 'default'));
        if (!nocleandirectory) {
            await exec(`sfdx dmg:source:cleanup`);
        }
        await exec(`sfdx force:source:retrieve -u ${targetusername} -x ${manifest}`);
    }
}