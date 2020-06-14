import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as csvWriter from "csv-write-stream";
import * as fetch from "node-fetch";
import * as Papa from "papaparse";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "files");

export default class GetFromCsv extends SfdxCommand {
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
  };

  private count;
  private errorCount;
  private successWriter;
  private errorWriter;
  private conn;

  protected static requiresUsername = true;

  public async run(): Promise<any> {
    let startTime = Number(new Date());
    const sourceFile = fs.createReadStream(this.flags.source);
    const target = this.flags.target;
    this.count = 0;
    this.errorCount = 0;
    fs.mkdirSync(target, { recursive: true });
    this.successWriter = csvWriter();
    this.errorWriter = csvWriter();
    this.successWriter.pipe(
      fs.createWriteStream(join(target, "success.csv"), { flags: "w" })
    );
    this.errorWriter.pipe(
      fs.createWriteStream(join(target, "error.csv"), { flags: "w" })
    );
    this.conn = this.org.getConnection();
    let orgInfo = await this.conn.query("SELECT Id, Name FROM Organization");
    console.log(orgInfo.records);
    let records = await (<any>this.getCsv(sourceFile));
    for (const attachment of records) {
      try {
        let elapsedTime = (Number(new Date()) - startTime) / 1000 / 60;
        console.log(
          "Processing row number: ",
          this.count + 1,
          "of ",
          records.length
        );
        console.log(
          "Elapsed time:",
          (Number(new Date()) - startTime) / 1000 / 60
        );
        console.log(
          "Record Processing Rate:",
          (this.count + 1) / (elapsedTime / 60)
        );
        console.log("ID column: ", attachment["Id"]);
        const path = join(target, "attachments", attachment["Id"]);
        console.log("Desired destination path: ", path);
        fs.mkdirSync(path, { recursive: true });
        let csvRow = await this.getFile(path, attachment);
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
      "rows with",
      this.errorCount,
      "errors."
    );
    let endTime = Number(new Date());
    console.log("Start time:", new Date(startTime));
    console.log("End time:", new Date(endTime));
    console.log("Total time (minutes):", (endTime - startTime) / 1000 / 60);
    return;
  }

  private async getCsv(sourceFile) {
    return new Promise((resolve) => {
      Papa.parse(sourceFile, {
        header: true,
        transformHeader: function (header) {
          return header.trim();
        },
        transform: function (value, header) {
          if (header.toLowerCase() === "name") {
            return value.replace(/[/\\?%*:|"<>]/g, "-");
          }
          return value;
        },
        complete: function (results) {
          resolve(results.data);
        },
      });
    });
  }

  private async getFile(path, attachment) {
    console.log("getting file");
    let fileName = join(path, attachment["Name"]);
    console.log(fileName);
    let url =
      this.conn.instanceUrl +
      "/services/data/v" +
      this.conn.version +
      "/sobjects/Attachment/" +
      attachment["Id"] +
      "/Body";
    console.log(url);
    await fetch(url, {
      headers: { Authorization: `Bearer ${this.conn.accessToken}` },
    }).then((image) =>
      image.body
        .pipe(fs.createWriteStream(fileName))
        .on("close", () => console.log("downloaded"))
    );
    let csvRow = attachment;
    csvRow["Body"] = fileName;
    csvRow["PathOnClient"] = fileName;
    return csvRow;
  }
}
