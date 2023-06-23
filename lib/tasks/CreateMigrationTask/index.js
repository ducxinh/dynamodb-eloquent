"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMigrationTask = void 0;
const dynamodb_repository_1 = __importDefault(require("../../contracts/dynamodb.repository"));
class CreateMigrationTask {
    static async handle() {
        const ddbRepo = new dynamodb_repository_1.default();
        const { TableNames } = await ddbRepo.listTables({ Limit: -1 });
        console.log(TableNames);
    }
}
exports.CreateMigrationTask = CreateMigrationTask;
exports.default = CreateMigrationTask;
//# sourceMappingURL=index.js.map