import ModelNotFoundExceptionExport from "./contracts/exceptions/modelNotFound.exception";
import DynamoDBRepo from "./contracts/dynamodb.repository";
export declare const DynamoDBRepository: typeof DynamoDBRepo;
export declare const ModelNotFoundException: typeof ModelNotFoundExceptionExport;
export declare function square(number: number): number;
