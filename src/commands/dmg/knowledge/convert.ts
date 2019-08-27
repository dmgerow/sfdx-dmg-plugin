import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import * as fs from "fs";
import * as Papa from "papaparse";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "knowledge");

export default class KnowledgeConversion extends SfdxCommand {
    public static description = messages.getMessage("convert.description");
    public static examples = [];

    public static readonly flagsConfig = {
        source: flags.string({
            char: "s",
            description: messages.getMessage("convert.flags.source"),
            required: true
        }),
        target: flags.string({
            char: "t",
            description: messages.getMessage("convert.flags.target"),
            required: true
        })
    };

    public async run(): Promise<any> {
        const source = this.flags.source;
        const target = this.flags.target;
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
                // console.log(result);
                targetJson.meta = result.meta;
                let csvRow = result.data;
                csvRow.Assigned = "Papa Parse";
                targetJson.data.push(csvRow);
                count++;
            },
            complete: function (results, file) {
                const targetCsv = Papa.unparse(targetJson);
                fs.writeFileSync(target, targetCsv);
                console.log('parsing complete read', count, 'records.');
            }
        });
        return;
    }

}