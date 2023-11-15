export interface PaginationProps {
    index?: string;
    limit: number | string;
    nextKey?: string;
    ScanIndexForward?: boolean;
    where?: any;
}
export interface PaginationScanProps {
    Limit?: number | undefined;
    ExclusiveStartKey: any;
    TableName: string;
}
export interface PaginationQuery {
    index: string;
    limit: number;
    nextKey?: string;
    ScanIndexForward?: boolean;
    where?: any;
}
export interface FindAllParams {
    limit?: number;
    exclusiveStartKey?: any;
}
export interface ScanParams {
    limit?: number;
    filter?: any;
    exclusiveStartKey?: any;
}
export interface DDBInterface {
    table: string;
    useSortDelete?: boolean;
    create: (data: any) => void;
    createMany: (data: any[]) => void;
    findAll: (options: {
        limit?: number;
    }) => void;
    findAllItems: (options?: any) => void;
    paginate: (params: PaginationProps) => void;
    update: (data: any) => void;
    updateMany: (data: any[]) => void;
    findBy: (conditions: any, indexName?: string) => void;
    findOneBy: (conditions: any, indexName: string) => void;
    findByIds: (itemIds: string[] | number[]) => void;
    findItemsByIds: (itemIds: string[] | number[]) => void;
    findOne: (id: any, keyName?: string) => void;
    findOrFail: (id: any, keyName?: string) => void;
    count: () => void;
    delete: (id: any, keyName?: string) => void;
    deleteMany: (ids: any[]) => void;
    truncate: () => void;
    query: (conditions: any, keys: any, indexName?: any) => void;
    listTables: () => void;
    createTable: (params: any) => void;
    createTableIfNotExisting: (params: any) => void;
    updateTable: (params: any) => void;
    showTable: (tableName: string) => void;
    dropTables: () => void;
    deleteTable: (tableName: string) => void;
    transaction: (items: any[]) => void;
    setTable: (tableName: string) => void;
    getTableTable: () => string;
}
