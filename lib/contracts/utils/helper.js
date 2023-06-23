"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryV2 = exports.parseQuery = exports.resolvePagination = exports.parseLastEvaluatedKeyToString = exports.resolveDDBClientConfig = exports.chunks = void 0;
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
    const config = {};
    if (process.env.DDB_ENDPOINT) {
        config.endpoint = process.env.DDB_ENDPOINT;
    }
    if (process.env.AWS_REGION) {
        config.region = process.env.AWS_REGION;
    }
    return config;
}
exports.resolveDDBClientConfig = resolveDDBClientConfig;
function parseLastEvaluatedKeyToString(lastEvaluatedKeyValue) {
    if (!lastEvaluatedKeyValue) {
        return null;
    }
    const lastEvaluatedKey = lastEvaluatedKeyValue;
    return Buffer.from(JSON.stringify(lastEvaluatedKey)).toString("base64");
}
exports.parseLastEvaluatedKeyToString = parseLastEvaluatedKeyToString;
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
function parseQuery(conditions) {
    const keyConditionExpression = [];
    const expressionAttributeValues = {};
    Object.keys(conditions).map((attributeKey, index) => {
        const fieldId = `field${index}`;
        keyConditionExpression.push(`${attributeKey} = :${fieldId}`);
        expressionAttributeValues[`:${fieldId}`] = conditions[attributeKey];
        return attributeKey;
    });
    return {
        KeyConditionExpression: keyConditionExpression.join(" and "),
        ExpressionAttributeValues: expressionAttributeValues,
    };
}
exports.parseQuery = parseQuery;
function parseQueryV2(params, keys) {
    const indexKeys = keys || [];
    let keyConditionExpression = "";
    let filterExpression = "";
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    Object.keys(params).map((keyName) => {
        const value = params[keyName];
        if (indexKeys.includes(keyName)) {
            if (keyConditionExpression)
                keyConditionExpression += " AND ";
            keyConditionExpression += `#${keyName} = :${keyName}`;
        }
        else {
            if (filterExpression)
                filterExpression += " AND ";
            if (Array.isArray(value)) {
                const valueExpress = value.map((valueItem, index) => {
                    const aliasName = `:${keyName}${index}`;
                    expressionAttributeValues[aliasName] = valueItem;
                    return aliasName;
                });
                filterExpression += `#${keyName} IN (${valueExpress.join(", ")})`;
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
//# sourceMappingURL=helper.js.map