import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as Papa from "papaparse";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "files");

export default class Base64Decode extends SfdxCommand {
    public static description = messages.getMessage("base64decode.description");
    public static examples = [];

    public static readonly flagsConfig = {
        source: flags.string({
            char: "s",
            description: messages.getMessage("base64decode.flags.source"),
            required: true
        }),
        target: flags.string({
            char: "t",
            description: messages.getMessage("base64decode.flags.target"),
            required: true
        }),
        base64column: flags.string({
            char: "c",
            description: messages.getMessage("base64decode.flags.base64column"),
            required: true
        }),
        filenamecolumn: flags.string({
            char: "f",
            description: messages.getMessage("base64decode.flags.filenamecolumn"),
            required: true
        })
    };

    public async run(): Promise<any> {
        const source = this.flags.source;
        const target = this.flags.target;
        const base64column = this.flags.base64column;
        const filenamecolumn = this.flags.filenamecolumn;
        const parentIdColumn = "Legacy_Case_Number__c";
        const sourceFile = fs.createReadStream(source);
        let count = 0;
        let targetJson = {
            meta: {},
            data: []
        };
        // await fs.promises.mkdir(join(target, "attachments"), { recursive: true });
        Papa.parse(sourceFile, {
            worker: true,
            header: true,
            step: function (result) {
                const path = join(target, "attachments", result.data[parentIdColumn]);
                fs.mkdirSync(path, { recursive: true });
                fs.writeFileSync(join(path, result.data[filenamecolumn]), result.data[base64column], 'base64');
                targetJson.meta = result.meta;
                let csvRow = result.data;
                csvRow[base64column] = join("attachments", result.data[parentIdColumn], result.data[filenamecolumn]);
                targetJson.data.push(csvRow);
                count++;
            },
            complete: function (results, file) {
                const targetCsv = Papa.unparse(targetJson);
                fs.writeFileSync(join(target, "files.csv"), targetCsv);
                console.log('Processed', count, 'rows.');
            }
        });
        return;
    }

}