"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.square = exports.ModelNotFoundException = exports.DynamoDBRepository = void 0;
const modelNotFound_exception_1 = __importDefault(require("./contracts/exceptions/modelNotFound.exception"));
const dynamodb_repository_1 = __importDefault(require("./contracts/dynamodb.repository"));
exports.DynamoDBRepository = dynamodb_repository_1.default;
exports.ModelNotFoundException = modelNotFound_exception_1.default;
function square(number) {
    return number * number;
}
exports.square = square;
//# sourceMappingURL=index.js.map