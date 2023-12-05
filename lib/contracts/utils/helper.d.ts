import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
export declare function chunks(arr: any[], chunkSize: number): any[];
export declare function resolveDDBClientConfig(): DynamoDBClientConfig;
export declare function resolvePagination(limit: number, dataResponse: any): {
    data: any;
    pagination: {
        nextKey: string | undefined;
        count: any;
        perPage: number;
    };
};
export declare function parseLastEvaluatedKeyToString(lastEvaluatedKeyValue: any): string | undefined;
export declare function parseNextKeyInput(value: any): any;
export declare function parseQuery(conditions: any): {
    KeyConditionExpression: string;
    ExpressionAttributeValues: any;
};
export declare function parseQueryV2(params: any, keys: any): any;
export declare function parseScanFilter(params: any): any;
