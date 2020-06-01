import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as uuidv4 from "uuid/v4";
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
      required: true,
    }),
    target: flags.string({
      char: "t",
      description: messages.getMessage("convert.flags.target"),
      required: true,
    }),
    htmlcolumns: flags.string({
      char: "h",
      description: messages.getMessage("convert.flags.htmlcolumns"),
    }),
    filenamecolumn: flags.string({
      char: "f",
      description: messages.getMessage("convert.flags.filenamecolumn"),
    }),
    base64column: flags.string({
      char: "c",
      description: messages.getMessage("convert.flags.base64column"),
    }),
  };

  public async run(): Promise<any> {
    const source = this.flags.source;
    const target = this.flags.target;
    let htmlcolumns = [];
    if (this.flags.htmlcolumns && this.flags.htmlcolumns.includes(",")) {
      htmlcolumns = this.flags.htmlcolumns.split(",");
    } else if (this.flags.htmlcolumns) {
      htmlcolumns.push(this.flags.htmlcolumns);
    }
    const filenamecolumn = this.flags.filenamecolumn;
    const base64column = this.flags.base64column;
    const sourceFile = fs.createReadStream(source);
    let count = 0;
    let targetJson = {
      meta: {},
      data: [],
    };
    await fs.promises.mkdir(join(target, "attachments"), { recursive: true });
    await fs.promises.mkdir(join(target, "html"), { recursive: true });
    Papa.parse(sourceFile, {
      worker: true,
      header: true,
      step: function (result) {
        targetJson.meta = result.meta;
        let csvRow = result.data;
        htmlcolumns.forEach(function (htmlheader) {
          if (result.data[htmlheader]) {
            let htmFileName = uuidv4().replace(/-/g, "") + ".htm";
            fs.writeFileSync(
              join(target, "html", htmFileName),
              result.data[htmlheader]
            );
            csvRow[htmlheader] = join("html", htmFileName);
          }
        });
        if (
          filenamecolumn &&
          base64column &&
          result.data[base64column] &&
          result.data[filenamecolumn]
        ) {
          fs.writeFileSync(
            join(target, "attachments", result.data[filenamecolumn]),
            result.data[base64column],
            "base64"
          );
          csvRow[base64column] = join(
            "attachments",
            result.data[filenamecolumn]
          );
        }
        targetJson.data.push(csvRow);
        count++;
      },
      complete: function (results, file) {
        const targetCsv = Papa.unparse(targetJson);
        fs.writeFileSync(join(target, "knowledge.csv"), targetCsv);
        console.log("Processed", count, "rows.");
      },
    });
    return;
  }
}
