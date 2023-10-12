import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
export declare function chunks(arr: any[], chunkSize: number): any[];
export declare function resolveDDBClientConfig(): DynamoDBClientConfig;
export declare function parseLastEvaluatedKeyToString(lastEvaluatedKeyValue: any): string | null;
export declare function resolvePagination(limit: number, dataResponse: any): {
    data: any;
    pagination: {
        nextKey: string | null;
        count: any;
        perPage: number;
    };
};
export declare function parseQuery(conditions: any): {
    KeyConditionExpression: string;
    ExpressionAttributeValues: any;
};
export declare function parseQueryV2(params: any, keys: any): any;
