"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DynamoDBRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const credential_providers_1 = require("@aws-sdk/credential-providers");
const uuid_1 = require("uuid");
const modelNotFound_exception_1 = __importDefault(require("./exceptions/modelNotFound.exception"));
const helper_1 = require("./utils/helper");
let DynamoDBRepository = DynamoDBRepository_1 = class DynamoDBRepository {
    constructor() {
        this.table = '';
        this.useSortDelete = false;
        this.mappingIndex = {
            id: 'id',
            email: 'email',
        };
    }
    getTableTable() {
        return this.table;
    }
    setTable(tableName) {
        this.table = tableName;
    }
    setConfig({ profile, region, accessKeyId, secretAccessKey, sessionToken, }) {
        let initialConfig = {};
        if (profile) {
            initialConfig = {
                credentials: (0, credential_providers_1.fromIni)({ profile: profile }),
            };
        }
        if (accessKeyId && secretAccessKey) {
            initialConfig = {
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            };
        }
        if (region)
            initialConfig.region = region;
        DynamoDBRepository_1.ddbClient = new client_dynamodb_1.DynamoDBClient(initialConfig);
        DynamoDBRepository_1.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(DynamoDBRepository_1.ddbClient);
    }
    async create(data) {
        const item = {
            id: (0, uuid_1.v4)(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...data,
        };
        const input = {
            TableName: this.getTableTable(),
            Item: item,
        };
        const params = new lib_dynamodb_1.PutCommand(input);
        await DynamoDBRepository_1.ddbDocClient.send(params);
        return item;
    }
    async createMany(items) {
        const chunkIds = (0, helper_1.chunks)(items, 25);
        const promises = [];
        chunkIds.map((chunkItemIds) => {
            promises.push(this.createManyChunk(chunkItemIds));
            return chunkItemIds;
        });
        const data = await Promise.all(promises);
        return data.flat();
    }
    async createManyChunk(dataItems) {
        const createdItems = [];
        const items = dataItems.map(dataItem => {
            const item = {
                id: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...dataItem,
            };
            createdItems.push(item);
            return {
                PutRequest: {
                    Item: item,
                },
            };
        });
        const input = {
            RequestItems: {
                [this.getTableTable()]: items,
            },
        };
        await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(input));
        return createdItems;
    }
    // todo refactor update item
    async update(data) {
        const newItem = { ...data, updatedAt: new Date().toISOString() };
        const params = new lib_dynamodb_1.PutCommand({
            TableName: this.getTableTable(),
            Item: newItem,
        });
        await DynamoDBRepository_1.ddbDocClient.send(params);
        return newItem;
    }
    async updateMany(items) {
        const chunkIds = (0, helper_1.chunks)(items, 25);
        const promises = [];
        chunkIds.map((chunkItemIds) => {
            promises.push(this.updateManyChunk(chunkItemIds));
            return chunkItemIds;
        });
        const data = await Promise.all(promises);
        return data.flat();
    }
    async updateManyChunk(dataItems) {
        const createdItems = [];
        const items = dataItems.map(dataItem => {
            const item = {
                updatedAt: new Date().toISOString(),
                ...dataItem,
            };
            createdItems.push(item);
            return {
                PutRequest: {
                    Item: item,
                },
            };
        });
        const input = {
            RequestItems: {
                [this.getTableTable()]: items,
            },
        };
        await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(input));
        return createdItems;
    }
    async findAll(options = {}) {
        const items = await this.findAllWithTrashed(options);
        if (this.useSortDelete) {
            return items.filter(item => !item.deletedAt);
        }
        return items;
    }
    async findAllWithTrashed(options = {}) {
        const input = {
            TableName: this.getTableTable(),
        };
        if (options.exclusiveStartKey)
            input.ExclusiveStartKey = options.exclusiveStartKey;
        if (options.limit)
            input.Limit = options.limit;
        const params = new lib_dynamodb_1.ScanCommand(input);
        const result = await DynamoDBRepository_1.ddbDocClient.send(params);
        return result.Items;
    }
    async findAllItems(filter) {
        let items = [];
        let exclusiveStartKey = null;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-await-in-loop
            const dataResponse = await this.scanData({
                filter,
                exclusiveStartKey,
            });
            items = [...items, ...dataResponse.Items];
            if (dataResponse.LastEvaluatedKey) {
                exclusiveStartKey = dataResponse.LastEvaluatedKey;
            }
            else {
                break;
            }
        }
        return items;
    }
    async scanData(options = {}) {
        const input = {
            TableName: this.getTableTable(),
            Select: 'ALL_ATTRIBUTES',
        };
        if (options.filter)
            input.ScanFilter = options.filter;
        if (options.exclusiveStartKey)
            input.ExclusiveStartKey = options.exclusiveStartKey;
        if (options.limit)
            input.Limit = options.limit;
        const result = await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand(input));
        return result;
    }
    async scanDataV2(options = {}) {
        let input = {
            TableName: this.getTableTable(),
            Select: 'ALL_ATTRIBUTES',
        };
        if (options.filter) {
            input = { ...input, ...(0, helper_1.parseScanFilter)(options.filter) };
        }
        if (options.nextKey)
            input.ExclusiveStartKey = (0, helper_1.parseNextKeyInput)(options.nextKey);
        if (options.limit)
            input.Limit = options.limit;
        const result = await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand(input));
        return {
            ...result,
            nextKey: (0, helper_1.parseLastEvaluatedKeyToString)(result.LastEvaluatedKey),
        };
    }
    async delete(id, keyName = 'id') {
        if (this.useSortDelete) {
            return this.sortDelete(id, keyName);
        }
        const input = {
            TableName: this.getTableTable(),
            Key: { [keyName]: id },
        };
        const result = await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.DeleteCommand(input));
        return result;
    }
    async sortDelete(id, keyName = 'id') {
        const item = await this.findOrFail(id, keyName);
        item.deletedAt = new Date().toISOString();
        const result = await this.update(item);
        return result;
    }
    async deleteMany(ids) {
        const chunkIds = (0, helper_1.chunks)(ids, 25);
        const promises = [];
        chunkIds.map((chunkItemIds) => {
            promises.push(this.deleteManyChunk(chunkItemIds));
            return chunkItemIds;
        });
        const data = await Promise.all(promises);
        return data.flat();
    }
    async deleteManyChunk(ids) {
        const items = ids.map(id => {
            return {
                DeleteRequest: {
                    Key: {
                        id,
                    },
                },
            };
        });
        const input = {
            RequestItems: {
                [this.getTableTable()]: items,
            },
        };
        await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.BatchWriteCommand(input));
    }
    async findOneWithTrashed(id, keyName = 'id') {
        const input = {
            TableName: this.getTableTable(),
            Key: { [keyName]: id },
        };
        const params = new lib_dynamodb_1.GetCommand(input);
        const result = await DynamoDBRepository_1.ddbDocClient.send(params);
        return result.Item;
    }
    async findOne(id, keyName = 'id') {
        const item = await this.findOneWithTrashed(id, keyName);
        if (item?.deletedAt)
            return undefined;
        return item;
    }
    async findOrFailWithTrashed(id, keyName = 'id') {
        const item = await this.findOneWithTrashed(id, keyName);
        if (!item)
            throw new modelNotFound_exception_1.default({ model: this.getTableTable() });
        return item;
    }
    async findOrFail(id, keyName = 'id') {
        const item = await this.findOrFailWithTrashed(id, keyName);
        if (this.useSortDelete && item.deletedAt) {
            throw new modelNotFound_exception_1.default({ model: this.getTableTable() });
        }
        return item;
    }
    resolveIndexField(indexName) {
        let indexField;
        if (this.mappingIndex && this.mappingIndex[indexName]) {
            indexField = this.mappingIndex[indexName];
        }
        else {
            console.warn(`The Index: ${indexName} or mappingIndex is not configured correctly. this.mappingIndex: ${JSON.stringify(this.mappingIndex || {})}`);
        }
        return indexField;
    }
    // async findOneBy(conditions: any, indexName?: string) {
    //   const items = await this.findBy(conditions, indexName);
    //   return items.length ? items[0] : null;
    // }
    // async findBy(conditions: any, index?: string) {
    //   const indexName = index || this.resolveIndexNameByKey(conditions);
    //   const input: QueryCommandInput = {
    //     TableName: this.getTableTable(),
    //     IndexName: indexName,
    //     ...parseQuery(conditions),
    //   };
    //   const params: QueryCommand = new QueryCommand(input);
    //   const result = await DynamoDBRepository.ddbDocClient.send(params);
    //   return result.Items as any[];
    // }
    async findOneBy(conditions, index) {
        return this.findOneByV2(conditions, index);
    }
    async findBy(conditions, index) {
        return this.findByV2(conditions, index);
    }
    async findOneByV2(conditions, index) {
        const items = await this.findByV2(conditions, index);
        return items.length ? items[0] : null;
    }
    async findByV2(conditions, index) {
        const indexName = index || this.resolveIndexNameByKey(conditions);
        let indexField;
        if (indexName) {
            indexField = this.resolveIndexField(indexName);
        }
        const input = {
            TableName: this.getTableTable(),
            IndexName: indexName,
            ...(0, helper_1.parseQueryV2)(conditions, indexField),
        };
        const params = new lib_dynamodb_1.QueryCommand(input);
        const result = await DynamoDBRepository_1.ddbDocClient.send(params);
        return result.Items;
    }
    async findByIds(itemIds) {
        const items = await this.findByIdsWithTrashed(itemIds);
        if (this.useSortDelete) {
            return items.filter(item => !item.deletedAt);
        }
        return items;
    }
    async findByIdsWithTrashed(itemIds) {
        const chunkIds = (0, helper_1.chunks)(itemIds, 25);
        const promises = [];
        chunkIds.map((chunkItemIds) => {
            promises.push(this.findItemsByIds(chunkItemIds));
            return chunkItemIds;
        });
        const data = await Promise.all(promises);
        return data.flat();
    }
    async findItemsByIds(itemIds) {
        const uniqueItemIds = [...new Set(itemIds)];
        const input = {
            RequestItems: {
                [this.getTableTable()]: {
                    Keys: uniqueItemIds.map(itemId => ({ id: itemId })), // Convert itemIds array into an array of key objects
                },
            },
        };
        const params = new lib_dynamodb_1.BatchGetCommand(input);
        const result = await DynamoDBRepository_1.ddbDocClient.send(params);
        if (result.Responses) {
            return result.Responses[this.getTableTable()];
        }
        return [];
    }
    async paginate(params = { limit: 25 }) {
        const { index, nextKey } = params;
        const limit = typeof params.limit === 'number' ? params.limit : parseInt(params.limit || '25', 10);
        const input = {
            Limit: limit,
            TableName: this.getTableTable(),
        };
        if (nextKey)
            input.ExclusiveStartKey = nextKey;
        if (index) {
            const data = await this.paginateQuery(limit, { ...params, limit, index });
            return data;
        }
        const data = await this.paginateScan(input);
        return data;
    }
    async paginateV2(params = { limit: 25 }) {
        const { index, nextKey } = params;
        const limit = typeof params.limit === 'number' ? params.limit : parseInt(params.limit || '25', 10);
        const input = {
            Limit: limit,
            TableName: this.getTableTable(),
        };
        if (nextKey)
            input.ExclusiveStartKey = (0, helper_1.parseNextKeyInput)(nextKey);
        if (index) {
            const data = await this.paginateQuery(limit, { ...params, limit, index });
            return data;
        }
        const data = await this.paginateScan(input);
        return data;
    }
    async paginateScan(params) {
        const dataResponse = await DynamoDBRepository_1.ddbDocClient.send(new lib_dynamodb_1.ScanCommand(params));
        return (0, helper_1.resolvePagination)(params.Limit, dataResponse);
    }
    async paginateQuery(limit, params) {
        const { index, nextKey, ...rest } = params;
        const options = { Limit: limit, ...rest };
        if (nextKey)
            options.ExclusiveStartKey = nextKey;
        const conditions = params.where || {};
        const dataResponse = await this.paginateQueryChunk(index, conditions, options);
        return (0, helper_1.resolvePagination)(limit, dataResponse);
    }
    async paginateQueryChunk(indexName, conditions, params = {}) {
        const indexField = this.resolveIndexField(indexName);
        const where = (0, helper_1.parseQueryV2)(conditions, indexField);
        const { paginate, ...otherParams } = params;
        const input = {
            TableName: this.getTableTable(),
            // Select: 'ALL_ATTRIBUTES',
            IndexName: indexName,
            ...where,
            ...otherParams,
        };
        const command = new lib_dynamodb_1.QueryCommand(input);
        const dataResponse = await DynamoDBRepository_1.ddbClient.send(command);
        const { Items, LastEvaluatedKey, Count } = dataResponse;
        const items = Items;
        return {
            Items: items,
            LastEvaluatedKey,
            Count,
        };
    }
    async query(conditions, keys, indexName = null) {
        const where = (0, helper_1.parseQueryV2)(conditions, keys);
        const input = {
            TableName: this.getTableTable(),
            Select: 'ALL_ATTRIBUTES',
            ...where,
        };
        if (indexName) {
            input.IndexName = indexName;
        }
        const command = new lib_dynamodb_1.QueryCommand(input);
        const response = await DynamoDBRepository_1.ddbClient.send(command);
        return response.Items;
    }
    async truncate() {
        const dataItems = await this.findAllItems();
        await this.deleteMany(dataItems.map(item => item.id));
    }
    async listTables(params = {}) {
        const listTablesTask = async (subParams) => {
            const input = {
                // Limit: params.Limit,
                // ExclusiveStartTableName: params.ExclusiveStartTableName,
                ...subParams,
            };
            const subResponse = await DynamoDBRepository_1.ddbClient.send(new client_dynamodb_1.ListTablesCommand(input));
            return subResponse;
        };
        if (params.Limit && params.Limit > 100)
            params.Limit = 100;
        if (params.Limit !== -1) {
            const response = await listTablesTask(params);
            return response;
        }
        let resultTables = [];
        let inputParams = { Limit: 100 };
        while (true) {
            const response = await listTablesTask(inputParams);
            if (response.TableNames) {
                resultTables = [...resultTables, ...response.TableNames];
            }
            if (response.LastEvaluatedTableName) {
                inputParams.ExclusiveStartTableName = response.LastEvaluatedTableName;
            }
            else {
                break;
            }
        }
        return {
            TableNames: resultTables,
        };
    }
    async createTable(params) {
        const input = {
            ...params,
            TableName: params.TableName,
            BillingMode: params.BillingMode || 'PAY_PER_REQUEST',
            KeySchema: params.KeySchema,
            // GlobalSecondaryIndexes: params.GlobalSecondaryIndexes,
            // LocalSecondaryIndexes: params.LocalSecondaryIndexes,
            // ProvisionedThroughput: params.ProvisionedThroughput,
            // AttributeDefinitions: params.AttributeDefinitions,
        };
        const response = await DynamoDBRepository_1.ddbClient.send(new client_dynamodb_1.CreateTableCommand(input));
        return response;
    }
    async createTableIfNotExisting(params) {
        try {
            const response = await this.createTable(params);
            return response;
        }
        catch (error) {
            if (!(error instanceof client_dynamodb_1.ResourceInUseException)) {
                throw error;
            }
            return false;
        }
    }
    async updateTable(params) {
        const input = {
            ...params,
            TableName: params.TableName,
            BillingMode: params.BillingMode,
            // AttributeDefinitions: params.AttributeDefinitions,
            // GlobalSecondaryIndexUpdates: params.GlobalSecondaryIndexUpdates,
            // ProvisionedThroughput: params.ProvisionedThroughput,
            // ReplicaUpdates: params.ReplicaUpdates,
        };
        const response = await DynamoDBRepository_1.ddbClient.send(new client_dynamodb_1.UpdateTableCommand(input));
        return response;
    }
    async showTable(tableName) {
        const input = {
            TableName: tableName,
        };
        const response = await DynamoDBRepository_1.ddbClient.send(new client_dynamodb_1.DescribeTableCommand(input));
        return response;
    }
    async dropTables() {
        const tables = await this.listTables({ Limit: -1 });
        if (!tables.TableNames)
            return;
        const promises = [];
        for (const tableName of tables.TableNames) {
            promises.push(this.deleteTable(tableName));
        }
        await Promise.all(promises);
        return true;
    }
    async deleteTable(tableName) {
        const input = {
            TableName: tableName,
        };
        const response = await DynamoDBRepository_1.ddbClient.send(new client_dynamodb_1.DeleteTableCommand(input));
        return response;
    }
    resolveIndexNameByKey(conditions) {
        const conditionsFields = Object.keys(conditions);
        const supportKeys = Object.keys(this.mappingIndex);
        for (const supportKey of supportKeys) {
            if (conditionsFields.includes(supportKey))
                return supportKey;
        }
        return '';
    }
};
DynamoDBRepository.ddbClient = new client_dynamodb_1.DynamoDBClient((0, helper_1.resolveDDBClientConfig)());
DynamoDBRepository.ddbDocClient = lib_dynamodb_1.DynamoDBDocumentClient.from(DynamoDBRepository_1.ddbClient);
DynamoDBRepository = DynamoDBRepository_1 = __decorate([
    (0, inversify_1.injectable)()
], DynamoDBRepository);
exports.default = DynamoDBRepository;
//# sourceMappingURL=dynamodb.repository.js.map