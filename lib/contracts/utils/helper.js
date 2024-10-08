"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseScanFilter = exports.parseQueryV2 = exports.parseQuery = exports.parseNextKeyInput = exports.parseLastEvaluatedKeyToString = exports.resolvePagination = exports.resolveDDBClientConfig = exports.chunks = void 0;
const credential_providers_1 = require("@aws-sdk/credential-providers");
function chunks(arr, chunkSize) {
    const chunkItems = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        chunkItems.push(chunk);
    }
    return chunkItems;
}
exports.chunks = chunks;
function resolveDDBClientConfig() {
    let config = {};
    if (process.env.AWS_PROFILE) {
        config = {
            credentials: (0, credential_providers_1.fromIni)({ profile: process.env.AWS_PROFILE }),
        };
    }
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        // Skip set credentical for Lambda function
        if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
            config = {
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            };
        }
    }
    if (process.env.DDB_ENDPOINT) {
        config.endpoint = process.env.DDB_ENDPOINT;
    }
    if (process.env.AWS_REGION) {
        config.region = process.env.AWS_REGION;
    }
    return config;
}
exports.resolveDDBClientConfig = resolveDDBClientConfig;
function resolvePagination(limit, dataResponse) {
    const { Items, LastEvaluatedKey, Count } = dataResponse;
    return {
        data: Items,
        pagination: {
            nextKey: parseLastEvaluatedKeyToString(LastEvaluatedKey),
            count: Count,
            perPage: limit,
        },
    };
}
exports.resolvePagination = resolvePagination;
function parseLastEvaluatedKeyToString(lastEvaluatedKeyValue) {
    if (!lastEvaluatedKeyValue) {
        return undefined;
    }
    const lastEvaluatedKey = lastEvaluatedKeyValue;
    return Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64');
}
exports.parseLastEvaluatedKeyToString = parseLastEvaluatedKeyToString;
function parseNextKeyInput(value) {
    if (!value)
        return value;
    if (typeof value === 'string') {
        // Convert to Object: => { id: 'xxxx' }
        const actualNextKey = value ? JSON.parse(Buffer.from(value, 'base64').toString('ascii')) : null;
        return actualNextKey;
    }
    if (typeof value === 'object') {
        return value;
    }
    return value;
}
exports.parseNextKeyInput = parseNextKeyInput;
function parseQuery(conditions) {
    const keyConditionExpression = [];
    // const expressionAttributeNames: any = {};
    const expressionAttributeValues = {};
    Object.keys(conditions).map((attributeKey, index) => {
        const fieldId = `field${index}`;
        keyConditionExpression.push(`${attributeKey} = :${fieldId}`);
        // keyConditionExpression.push(`#${attributeKey} = :${fieldId}`);
        // expressionAttributeNames[`#${attributeKey}`] = attributeKey;
        expressionAttributeValues[`:${fieldId}`] = conditions[attributeKey];
        return attributeKey;
    });
    return {
        KeyConditionExpression: keyConditionExpression.join(' and '),
        // ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };
}
exports.parseQuery = parseQuery;
function parseQueryV2(params, keys) {
    const indexKeys = keys || [];
    let keyConditionExpression = '';
    let filterExpression = '';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    Object.keys(params).map(keyName => {
        const value = params[keyName];
        if (indexKeys.includes(keyName)) {
            if (keyConditionExpression)
                keyConditionExpression += ' AND ';
            keyConditionExpression += `#${keyName} = :${keyName}`;
        }
        else {
            if (filterExpression)
                filterExpression += ' AND ';
            if (Array.isArray(value)) {
                const valueExpress = value.map((valueItem, index) => {
                    const aliasName = `:${keyName}${index}`;
                    expressionAttributeValues[aliasName] = valueItem;
                    return aliasName;
                });
                filterExpression += `#${keyName} IN (${valueExpress.join(', ')})`;
                expressionAttributeNames[`#${keyName}`] = keyName;
                return keyName;
            }
            filterExpression += `#${keyName} = :${keyName}`;
        }
        expressionAttributeNames[`#${keyName}`] = keyName;
        expressionAttributeValues[`:${keyName}`] = value;
        return keyName;
    });
    const filterResult = {
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };
    if (filterExpression)
        filterResult.FilterExpression = filterExpression;
    return filterResult;
}
exports.parseQueryV2 = parseQueryV2;
function parseScanFilter(params) {
    let filterExpression = '';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    Object.keys(params).map(keyName => {
        const value = params[keyName];
        if (filterExpression)
            filterExpression += ' AND ';
        if (Array.isArray(value)) {
            const valueExpress = value.map((valueItem, index) => {
                const aliasName = `:${keyName}${index}`;
                expressionAttributeValues[aliasName] = valueItem;
                return aliasName;
            });
            filterExpression += `#${keyName} IN (${valueExpress.join(', ')})`;
            expressionAttributeNames[`#${keyName}`] = keyName;
            return keyName;
        }
        filterExpression += `#${keyName} = :${keyName}`;
        expressionAttributeNames[`#${keyName}`] = keyName;
        expressionAttributeValues[`:${keyName}`] = value;
        return keyName;
    });
    const filterResult = {
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    };
    filterResult.FilterExpression = filterExpression;
    return filterResult;
}
exports.parseScanFilter = parseScanFilter;
//# sourceMappingURL=helper.js.map