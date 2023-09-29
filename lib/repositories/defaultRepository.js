"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb_repository_1 = __importDefault(require("../contracts/dynamodb.repository"));
// import { DynamoDBRepository } from 'dynamodb-eloquent';
class DefaultRepository extends dynamodb_repository_1.default {
}
exports.default = new DefaultRepository();
//# sourceMappingURL=defaultRepository.js.map