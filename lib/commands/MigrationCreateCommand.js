"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationCreateCommand = void 0;
const path_1 = __importDefault(require("path"));
const process = __importStar(require("process"));
const CommandUtils_1 = require("./CommandUtils");
/**
 * Create migration command.
 */
class MigrationCreateCommand {
    constructor() {
        this.command = 'migration:create';
        this.describe = 'Runs all pending migrations.';
    }
    builder(args) {
        return args
            .option('tableSuffix', {
            alias: 's',
            describe: 'tableSuffix for table name',
            demandOption: false,
        })
            .option('table', {
            alias: 's',
            describe: 'table name: E.g Users',
            demandOption: true,
        });
    }
    async handler(args) {
        try {
            const timestamp = Date.now();
            const basePath = process.cwd();
            const tableName = args.table;
            const fileName = timestamp + '-' + tableName;
            const fullPath = path_1.default.resolve(basePath, 'src/database/migration', timestamp + '-' + tableName);
            const fileContent = MigrationCreateCommand.getTemplate(tableName);
            await CommandUtils_1.CommandUtils.createFile(fullPath + '.json', fileContent);
            console.log(`Migration ${fileName} has been generated successfully.`);
            process.exit(0);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
    static getTemplate(name) {
        let result = `{
  "TableName": "${name}",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "BillingMode": "PAY_PER_REQUEST",
`;
        const tags = null;
        if (tags) {
            result += `"Tags": [
      {
        "Key": "",
        "Value": ""
      }
    ]`;
        }
        return `${result}}`;
    }
    static getTemplateFull(name) {
        // const ProjectionType = 'ALL' | 'KEYS_ONLY'
        return `{
  "TableName": "${name}",
  "AttributeDefinitions": [
    { "AttributeName": "id", "AttributeType": "S" }
  ],
  "KeySchema": [
    { "AttributeName": "id", "KeyType": "HASH" }
  ],
  "LocalSecondaryIndexes": [],
  "GlobalSecondaryIndexes": [
    {
          "IndexName": "active",
          "KeySchema": [
              { "AttributeName": "active", "KeyType": "HASH" },
              { "AttributeName": "sortOrder", "KeyType": "RANGE" }
          ],
          "Projection": {
              "ProjectionType": "ALL"
          }
      }
  ],
  "BillingMode": "PAY_PER_REQUEST",
  "Tags": [
    {
      "Key": "",
      "Value": ""
    }
  ]
}    `;
    }
}
exports.MigrationCreateCommand = MigrationCreateCommand;
//# sourceMappingURL=MigrationCreateCommand.js.map