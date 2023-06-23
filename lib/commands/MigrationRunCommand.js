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
exports.MigrationRunCommand = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const process = __importStar(require("process"));
const defaultRepository_1 = __importDefault(require("../repositories/defaultRepository"));
/**
 * Runs migration command.
 */
class MigrationRunCommand {
    constructor() {
        this.command = "migration:run";
        this.describe = "Runs all pending migrations.";
    }
    builder(args) {
        return args.option("tableSuffix", {
            alias: "s",
            describe: "tableSuffix for table name",
            demandOption: false,
        });
    }
    async handler(args) {
        try {
            const tableSuffix = args.tableSuffix;
            const databasePath = path_1.default.resolve(process.cwd(), "src/database/migration");
            if (!fs_1.default.existsSync(databasePath)) {
                console.error(`The Migration folder does not exist: ${databasePath}`);
                process.exit(0);
            }
            const tableFiles = fs_1.default
                .readdirSync(databasePath)
                .filter((file) => file.split(".")[1] === "json");
            for (const tableFile of tableFiles) {
                await MigrationRunCommand.createTable(databasePath, tableFile, tableSuffix);
            }
            process.exit(0);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
    static async createTable(databasePath, tableFile, tableSuffix) {
        const tableDefinitionStr = fs_1.default.readFileSync(`${databasePath}/${tableFile}`, "utf8");
        const tableDefinition = JSON.parse(tableDefinitionStr);
        const { TableName } = tableDefinition;
        const tableName = tableSuffix ? `${TableName}-${tableSuffix}` : TableName;
        const input = {
            ...tableDefinition,
            TableName: tableName,
        };
        await defaultRepository_1.default.createTableIfNotExisting(input);
        console.log("created successfully");
    }
    static async buildTableName(tableName) { }
}
exports.MigrationRunCommand = MigrationRunCommand;
//# sourceMappingURL=MigrationRunCommand.js.map