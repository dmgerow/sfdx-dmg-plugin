import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
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
        const sourceFile = fs.createReadStream(source);
        let count = 0;
        let targetJson = {
            meta: {},
            data: []
        };
        Papa.parse(sourceFile, {
            worker: true,
            header: true,
            step: function (result) {
                console.log(filenamecolumn);
                console.log(result.data[base64column]);
                console.log(target + result.data[filenamecolumn]);
                let buff = Buffer.from(result.data[base64column], 'base64');
                fs.writeFileSync(target + result.data[filenamecolumn], buff);
                targetJson.meta = result.meta;
                let csvRow = result.data;
                csvRow[result.data[base64column]] = target + result.data[filenamecolumn];
                targetJson.data.push(csvRow);
                count++;
            },
            complete: function (results, file) {
                const targetCsv = Papa.unparse(targetJson);
                fs.writeFileSync(target + "theCsv.csv", targetCsv);
                console.log('parsing complete read', count, 'records.');
            }
        });
        return;
    }

}