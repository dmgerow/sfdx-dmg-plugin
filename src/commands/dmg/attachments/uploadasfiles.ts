import { flags, SfdxCommand } from "@salesforce/command";
import { Messages } from "@salesforce/core";
import { join } from "path";
import * as fs from "fs";
import * as csvWriter from "csv-write-stream";
import * as Papa from "papaparse";
import * as fetch from "node-fetch";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages("sfdx-dmg-plugin", "files");

export default class UploadAsFiles extends SfdxCommand {
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
  private hourSessionRefreshed;

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
      fs.createWriteStream(join(target, "success_files.csv"), { flags: "w" })
    );
    this.errorWriter.pipe(
      fs.createWriteStream(join(target, "error_files.csv"), { flags: "w" })
    );
    this.conn = this.org.getConnection();
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
        fs.mkdirSync(path, { recursive: true });
        let csvRow = await this.uploadFile(path, attachment);
        this.successWriter.write(csvRow);
        this.count++;
      } catch (error) {
        this.errorCount++;
        console.error(error);
        this.errorWriter.write(error);
      }
      console.log("===========================================");
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

  private async uploadFile(path, attachment) {
    await this.refreshSession();
    let fileName = join(path, attachment["Name"]);
    console.log("File name:", fileName);
    let url =
      this.conn.instanceUrl +
      "/services/data/v" +
      this.conn.version +
      "/sobjects/ContentVersion";
    console.log("URL:", url);
    const fileContents = fs.readFileSync(attachment["PathOnClient"], {
      encoding: "base64",
    });
    let requestBody = {
      Title: attachment["Name"],
      PathOnClient: attachment["Name"],
      VersionData: fileContents,
      FirstPublishLocationId: attachment["ParentId"],
      AttachmentId__c: attachment["Id"],
    };
    let csvRow = attachment;
    csvRow["VersionId"] = "";
    csvRow["Errors"] = "";
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.conn.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log("Upload response:", response);
        if (response["success"]) {
          csvRow["VersionId"] = response["id"];
        } else {
          csvRow["Errors"] = JSON.stringify(response["errors"]);
        }
        console.log("File Uploaded");
      });
    return csvRow;
  }

  private async refreshSession() {
    let currentHour = new Date().getHours();
    if (this.hourSessionRefreshed != currentHour) {
      console.log("Refreshing session since the hour has changed");
      let orgInfo = await this.conn.query("SELECT Id, Name FROM Organization");
      console.log(orgInfo.records);
      this.hourSessionRefreshed = currentHour;
    }
    return;
  }
}
