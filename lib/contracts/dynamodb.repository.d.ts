import 'reflect-metadata';
import { ListTablesCommandInput, CreateTableCommandInput, UpdateTableCommandInput } from '@aws-sdk/client-dynamodb';
import { PaginationProps, FindAllParams, ScanParams, ScanV2Params, FindByOptions } from './interface';
declare class DynamoDBRepository {
    protected table: string;
    protected useSortDelete: boolean;
    protected mappingIndex: any;
    private static ddbClient;
    private static ddbDocClient;
    getTableTable(): string;
    setTable(tableName: string): void;
    setMappingIndex(data: any): void;
    setConfig({ profile, region, accessKeyId, secretAccessKey, sessionToken, }: {
        profile?: string;
        region?: string;
        accessKeyId?: string;
        secretAccessKey?: string;
        sessionToken?: string;
    }): void;
    create(data: any): Promise<any>;
    createMany(items: any[]): Promise<any[]>;
    private createManyChunk;
    update(data: any): Promise<any>;
    updateMany(items: any): Promise<any[]>;
    private updateManyChunk;
    findAll(options?: FindAllParams): Promise<any[]>;
    findAllWithTrashed(options?: FindAllParams): Promise<any[]>;
    findAllItems(filter?: any): Promise<any[]>;
    scanData(options?: ScanParams): Promise<import("@aws-sdk/lib-dynamodb").ScanCommandOutput>;
    scanDataV2(options?: ScanV2Params): Promise<{
        nextKey: string | undefined;
        $metadata: import("@aws-sdk/types").ResponseMetadata;
        ConsumedCapacity?: import("@aws-sdk/client-dynamodb").ConsumedCapacity | undefined;
        Count?: number | undefined;
        ScannedCount?: number | undefined;
        Items?: Record<string, any>[] | undefined;
        LastEvaluatedKey?: Record<string, any> | undefined;
    }>;
    delete(id: any, keyName?: string): Promise<any>;
    sortDelete(id: any, keyName?: string): Promise<any>;
    deleteMany(ids: any[]): Promise<any[]>;
    private deleteManyChunk;
    findOneWithTrashed(id: any, keyName?: string): Promise<any>;
    findOne(id: any, keyName?: string): Promise<any>;
    findOrFailWithTrashed(id: any, keyName?: string): Promise<any>;
    findOrFail(id: any, keyName?: string): Promise<any>;
    resolveIndexField(indexName: string): any;
    findOneBy(conditions: any, index?: string): Promise<any>;
    findBy(conditions: any, index?: string, options?: FindByOptions): Promise<any[]>;
    private findOneByV2;
    private findByV2;
    findByIds(itemIds: any[]): Promise<any[]>;
    findByIdsWithTrashed(itemIds: any[]): Promise<any[]>;
    findItemsByIds(itemIds: any[]): Promise<any[]>;
    paginate(params?: PaginationProps): Promise<{
        data: any;
        pagination: {
            nextKey: string | undefined;
            count: any;
            perPage: number;
        };
    }>;
    paginateV2(params?: PaginationProps): Promise<{
        data: any;
        pagination: {
            nextKey: string | undefined;
            count: any;
            perPage: number;
        };
    }>;
    private paginateScan;
    private paginateQuery;
    private paginateQueryChunk;
    query(conditions: any, keys: string[], indexName?: string): Promise<Record<string, any>[] | undefined>;
    truncate(): Promise<void>;
    listTables(params?: ListTablesCommandInput): Promise<import("@aws-sdk/client-dynamodb").ListTablesCommandOutput | {
        TableNames: any[];
    }>;
    createTable(params: CreateTableCommandInput): Promise<import("@aws-sdk/client-dynamodb").CreateTableCommandOutput>;
    createTableIfNotExisting(params: CreateTableCommandInput): Promise<false | import("@aws-sdk/client-dynamodb").CreateTableCommandOutput>;
    updateTable(params: UpdateTableCommandInput): Promise<import("@aws-sdk/client-dynamodb").UpdateTableCommandOutput>;
    showTable(tableName: string): Promise<import("@aws-sdk/client-dynamodb").DescribeTableCommandOutput>;
    dropTables(): Promise<true | undefined>;
    deleteTable(tableName: string): Promise<import("@aws-sdk/client-dynamodb").DeleteTableCommandOutput>;
    private resolveIndexNameByKey;
}
export default DynamoDBRepository;
