"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunMigrationTask = void 0;
const dynamodb_repository_1 = __importDefault(require("../../contracts/dynamodb.repository"));
class RunMigrationTask {
    static async handle() {
        const ddbRepo = new dynamodb_repository_1.default();
        const { TableNames } = await ddbRepo.listTables({ Limit: -1 });
        console.log(TableNames);
    }
}
exports.RunMigrationTask = RunMigrationTask;
exports.default = RunMigrationTask;
//# sourceMappingURL=index.js.map