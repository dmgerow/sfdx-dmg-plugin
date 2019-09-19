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

export default class KnowledgeConversionOsc extends SfdxCommand {
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
        }),
        htmlcolumns: flags.string({
            char: "h",
            description: messages.getMessage("convert.flags.htmlcolumns")
        }),
        filenamecolumn: flags.string({
            char: "f",
            description: messages.getMessage("convert.flags.filenamecolumn")
        }),
        base64column: flags.string({
            char: "c",
            description: messages.getMessage("convert.flags.base64column")
        })
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
        const answerIdColumn = "Answer ID";
        const sourceFile = fs.createReadStream(source);
        const uniqueKnowledgeJson = {};
        const tier1Cat = "Tertiary-Product";
        const tier2Cat = "Sub-Product";
        const tier3Cat = "Product";
        const knowledgeMappings = {
            "Address Change": "Other",
            "Adoption": "Adoption",
            "Bicycle": "Commuter_Benefits_Bicycle_Reimbursement",
            "Bicycle Parking Inquiry": "Commuter_Benefits_Bicycle_Reimbursement",
            "Bicycle Transit Inquiry": "Commuter_Benefits_Bicycle_Reimbursement",
            "Billing (Retiree/Direct)": "N/A",
            "Call Transfers": "Other",
            "Claim or Carrier Inquiry": "N/A",
            "COBRA Benefits": "COBRA",
            "CPP - Computer Purchase Plan": "N/A",
            "Direct Bill": "Direct_Bill",
            "Employer Parking": "Commuter_Benefits_Parking",
            "EPP - Employee Purchase Plan": "N/A",
            "Explain Parking Benefits": "Commuter_Benefits_Parking",
            "Explain Transit Benefits": "Commuter_Benefits_Transit_Vanpool",
            "FSA": "FSA",
            "General": "Other",
            "HRA": "HRA",
            "HSA": "HSA",
            "iHRA": "HRA",
            "Parking": "Commuter_Benefits_Parking",
            "Parking Commuter Card": "Commuter_Benefits_Parking",
            "Parking Pay Me Back": "Commuter_Benefits_Parking",
            "Pay My Parking": "Commuter_Benefits_Parking",
            "Phone/Fax Request or Confirm": "N/A",
            "Post Office Return": "Commuter_Benefits_Transit_Vanpool",
            "Profile Update/Website Navigation": "Commuter",
            "Public Transportation Pay Me Back": "Commuter_Benefits_Transit_Vanpool",
            "Public Transportation/Vanpool": "Commuter_Benefits_Transit_Vanpool",
            "Retiree Bill": "Direct_Bill",
            "Retiree General Question": "N/A",
            "Retiree Health Care Account": "N/A",
            "Specific Product Inquiry": "Commuter_Benefits_Transit_Vanpool",
            "SPR - Spousal Reimbursement Plan": "N/A",
            "Transit Commuter Card": "Commuter_Benefits_Transit_Vanpool",
            "Tuition": "Tuition",
            "Vanpool": "Commuter_Benefits_Transit_Vanpool",
            "Wellness Bio Data": "N/A",
            "COBRA": "COBRA",
            "Commuter": "Commuter",
            "DC": "DC_FSA",
            "Enrollment & Eligibility": "E_E",
            "ESP": "ESP",
            "Gym Reimbursement": "Gym",
            "Health Care": "N/A",
            "Wellness": "Wellness",
        }
        let count = 0;
        let targetJson = {
            meta: {},
            data: []
        };
        let dataCategoriesByAnswerId = {};
        fs.mkdirSync(join(target, "attachments"), { recursive: true });
        fs.mkdirSync(join(target, "html"), { recursive: true });
        Papa.parse(sourceFile, {
            worker: true,
            header: true,
            step: function (result) {
                console.log(count + 2);
                targetJson.meta = result.meta;
                let csvRow = result.data;
                let exists = uniqueKnowledgeJson[csvRow[answerIdColumn]] ? true : false;

                // do mapping
                if (csvRow[tier1Cat]) {
                    csvRow[tier1Cat] = knowledgeMappings[csvRow[tier1Cat]];
                } else if (csvRow[tier2Cat]) {
                    csvRow[tier1Cat] = knowledgeMappings[csvRow[tier2Cat]];
                } else if (csvRow[tier3Cat]) {
                    csvRow[tier1Cat] = knowledgeMappings[csvRow[tier3Cat]];
                }

                let updatedRow = exists ? uniqueKnowledgeJson[csvRow[answerIdColumn]] : csvRow;

                // concatenate
                // if (updatedRow[dataCat] && !updatedRow[dataCat].includes(csvRow[tier1Cat] + '+')) {
                //     updatedRow[dataCat] = updatedRow[dataCat] + "+" + csvRow[tier1Cat];
                // } else {
                //     updatedRow[dataCat] = csvRow[tier1Cat];
                // }
                if (dataCategoriesByAnswerId[csvRow[answerIdColumn]]) {
                    if (!dataCategoriesByAnswerId[csvRow[answerIdColumn]].includes(csvRow[tier1Cat])) {
                        dataCategoriesByAnswerId[csvRow[answerIdColumn]].push(csvRow[tier1Cat]);
                    }
                } else {
                    dataCategoriesByAnswerId[csvRow[answerIdColumn]] = [csvRow[tier1Cat]];
                }

                if (!exists) {
                    htmlcolumns.forEach(function (htmlheader) {
                        if (updatedRow[htmlheader]) {
                            let htmFileName = uuidv4().replace(/-/g, '') + ".htm";
                            fs.writeFileSync(join(target, "html", htmFileName), updatedRow[htmlheader]);
                            updatedRow[htmlheader] = join("html", htmFileName);
                        }
                    });
                    if (filenamecolumn && base64column && updatedRow[base64column] && updatedRow[filenamecolumn]) {
                        fs.writeFileSync(join(target, "attachments", updatedRow[filenamecolumn]), updatedRow[base64column], 'base64');
                        updatedRow[base64column] = join("attachments", updatedRow[filenamecolumn]);
                    }
                }
                uniqueKnowledgeJson[updatedRow[answerIdColumn]] = updatedRow;
                // targetJson.data.push(csvRow);
                count++;
            },
            complete: function (results, file) {
                for (var key in uniqueKnowledgeJson) {
                    console.log(key);
                    let dataCategories = dataCategoriesByAnswerId[key];
                    console.log(dataCategories);
                    let dataCategoriesString = '';
                    if (dataCategories) {
                        dataCategories.forEach(category => {
                            dataCategoriesString += category + '+';
                        });
                    }
                    dataCategoriesString = dataCategoriesString.replace(/.$/, "");
                    console.log(dataCategoriesString);
                    uniqueKnowledgeJson[key][tier3Cat] = dataCategoriesString;
                    if (uniqueKnowledgeJson.hasOwnProperty(key)) {
                        targetJson.data.push(uniqueKnowledgeJson[key]);
                    }
                }
                const targetCsv = Papa.unparse(targetJson);
                fs.writeFileSync(join(target, "knowledgeConverted.csv"), targetCsv);
                console.log('Processed', count, 'rows.');
            }
        });
        return;
    }

}