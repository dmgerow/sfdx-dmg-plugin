import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as csvWriter from "csv-write-stream";
import * as fetch from "node-fetch";

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

  private count;
  private errorCount;
  private successWriter;
  private errorWriter;
  private conn;

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    const filterCritera = this.flags.filter;
    const target = this.flags.target;
    this.count = 0;
    this.errorCount = 0;
    this.successWriter = csvWriter();
    this.errorWriter = csvWriter();
    this.successWriter.pipe(
      fs.createWriteStream(join(target, "success.csv"), { flags: "w" })
    );
    this.errorWriter.pipe(
      fs.createWriteStream(join(target, "error.csv"), { flags: "w" })
    );
    this.conn = this.org.getConnection();
    // const results = await this.conn.query(
    //   "SELECT Id, Name, ParentId, Body FROM Attachment WHERE " + filterCritera
    // );
    let records = [];
    let query = await this.conn
      .query(
        "SELECT Id, Name, ParentId, Body FROM Attachment WHERE " + filterCritera
      )
      .on("record", function (record) {
        records.push(record);
      })
      .on("end", function () {
        console.log("total in database : " + query.totalSize);
        console.log("total fetched : " + query.totalFetched);
      })
      .on("error", function (err) {
        console.error(err);
      })
      .run({ autoFetch: true, maxFetch: 10000 });
    for (const attachment of records) {
      try {
        console.log(
          "Processing row number: ",
          this.count + 1,
          "of ",
          query.totalSize
        );
        console.log("ID column: ", attachment["Id"]);
        const path = join(target, "attachments", attachment["Id"]);
        console.log("Desired destination path: ", path);
        fs.mkdirSync(path, { recursive: true });
        await this.getFile(path, attachment);
        let csvRow = attachment;
        csvRow["Body"] = path;
        csvRow["PathOnClient"] = path;
        this.successWriter.write(csvRow);
        this.count++;
      } catch (error) {
        this.errorCount++;
        console.error(error);
        this.errorWriter.write(error);
      }
    }
    this.successWriter.end();
    this.errorWriter.end();
    console.log(
      "Processed",
      this.count,
      "rows with ",
      this.errorCount,
      " errors."
    );
    return;
  }

  // private async getRecords(conn, path, attachment) {
  //   return;
  // }

  private async getFile(path, attachment) {
    console.log("getting file");
    let fileName = join(path, attachment["Name"]);
    console.log(fileName);
    await fetch(`${this.conn.instanceUrl}${attachment["Body"]}`, {
      headers: { Authorization: `Bearer ${this.conn.accessToken}` },
    }).then((image) =>
      image.body
        .pipe(fs.createWriteStream(fileName))
        .on("close", () => console.log("downloaded"))
    );
    return;
  }
}
