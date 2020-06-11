import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as csvWriter from "csv-write-stream";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "files");

export default class GetFromCsv extends SfdxCommand {
  public static description = messages.getMessage("base64decode.description");
  public static examples = [];

  public static readonly flagsConfig = {
    filter: flags.string({
      char: "q",
      description: "filter criteria",
      required: true,
    }),
    target: flags.string({
      char: "t",
      description: messages.getMessage("base64decode.flags.target"),
      required: true,
    }),
  };

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const filterCritera = this.flags.filter;
    const target = this.flags.target;
    let count = 0;
    let errorCount = 0;
    var successWriter = csvWriter();
    var errorWriter = csvWriter();
    successWriter.pipe(
      fs.createWriteStream(join(target, "success.csv"), { flags: "w" })
    );
    errorWriter.pipe(
      fs.createWriteStream(join(target, "error.csv"), { flags: "w" })
    );
    const conn = this.org.getConnection();
    const results = await conn.query(
      "SELECT Id, Name, ParentId, Body FROM Attachment WHERE " + filterCritera
    );
    for (const attachment of results.records) {
      try {
        console.log("Processing row number: ", count + 1);
        console.log("Parent ID column: ", attachment["ParentId"]);
        const path = join(target, "attachments", attachment["ParentId"]);
        console.log("Desired destination path: ", path);
        fs.mkdirSync(path, { recursive: true });
        let csvRow = attachment;
        csvRow["Body"] = path;
        csvRow["PathOnClient"] = path;
        successWriter.write(csvRow);
        count++;
        await this.getFile(conn, path, attachment);
      } catch (error) {
        errorCount++;
        console.error(error);
        errorWriter.write(error);
      }
    }
    successWriter.end();
    errorWriter.end();
    console.log("Processed", count, "rows with ", errorCount, " errors.");
    return;
  }

  private async getFile(conn, path, attachment) {
    let fileOut = fs.createWriteStream(path);
    return new Promise((resolve) => {
      conn
        .sobject("Attachment")
        .record(attachment["Id"])
        .blob("Body")
        .pipe(fileOut);
    });
  }
}
