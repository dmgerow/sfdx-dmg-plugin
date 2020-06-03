import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as Papa from "papaparse";
import * as csvWriter from "csv-write-stream";

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
      required: true,
    }),
    target: flags.string({
      char: "t",
      description: messages.getMessage("base64decode.flags.target"),
      required: true,
    }),
    base64column: flags.string({
      char: "c",
      description: messages.getMessage("base64decode.flags.base64column"),
      required: true,
    }),
    filenamecolumn: flags.string({
      char: "f",
      description: messages.getMessage("base64decode.flags.filenamecolumn"),
      required: true,
    }),
    parentidcolumn: flags.string({
      char: "p",
      description: messages.getMessage("base64decode.flags.parentidcolumn"),
      required: true,
    }),
  };

  public async run(): Promise<any> {
    const source = this.flags.source;
    const target = this.flags.target;
    const base64column = this.flags.base64column;
    const filenamecolumn = this.flags.filenamecolumn;
    const parentidcolumn = this.flags.parentidcolumn;
    const sourceFile = fs.createReadStream(source);
    let count = 0;
    let errorCount = 0;
    var successWriter = csvWriter();
    var errorWriter = csvWriter();
    successWriter.pipe(
      fs.createWriteStream(join(target, "success.csv"), { flags: "a" })
    );
    errorWriter.pipe(
      fs.createWriteStream(join(target, "error.csv"), { flags: "a" })
    );
    Papa.parse(sourceFile, {
      header: true,
      transformHeader: function (header) {
        return header.trim();
      },
      step: function (result) {
        try {
          console.log("Processing row number: ", count + 2);
          console.log("Parent ID column: ", result.data[parentidcolumn]);
          const path = join(target, "attachments", result.data[parentidcolumn]);
          console.log("Desired destination path: ", path);
          fs.mkdirSync(path, { recursive: true });
          console.log("Decoding body");
          fs.writeFileSync(
            join(path, result.data[filenamecolumn]),
            result.data[base64column],
            "base64"
          );
          let csvRow = result.data;
          csvRow[base64column] = join(
            "attachments",
            result.data[parentidcolumn],
            result.data[filenamecolumn]
          );
          successWriter.write(csvRow);
          count++;
        } catch (error) {
          errorCount++;
          console.log("error!", error);
          errorWriter.write(error);
        }
      },
      complete: function () {
        successWriter.end();
        errorWriter.end();
        console.log("Processed", count, "rows with ", errorCount, " errors.");
      },
    });
    return;
  }
}
