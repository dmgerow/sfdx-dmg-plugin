import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from "@salesforce/core";
import fs = require('fs-extra');
// import { exec } from '../../../lib/execProm';
import { join } from 'path';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "source");

export default class Cleanup extends SfdxCommand {
    public static description = messages.getMessage("cleanup.description");

    public static examples = [];

    // protected static requiresUsername = true;

    public static readonly flagsConfig = {
        path: flags.string({
            char: "p",
            description: messages.getMessage("cleanup.flags.path")
        })
    };

    protected static requiresProject = true;

    // tslint:disable-next-line:no-any
    public async run(): Promise<any> {
        const path = this.flags.path ? this.flags.path : join('force-app', 'main', 'default');

        if (!fs.existsSync(path)) {
            this.ux.error('your path ' + path + ' doesn\'t exist');
        }

        fs.emptyDirSync(join(path, 'objects'));
        fs.emptyDirSync(join(path, 'objectTranslations'));

        process.stdout.write('Done!\n');
    }
}