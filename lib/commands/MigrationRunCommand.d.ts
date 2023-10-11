import * as yargs from 'yargs';
/**
 * Runs migration command.
 */
export declare class MigrationRunCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        tableSuffix: unknown;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
    protected static createTable(databasePath: string, tableFile: string, tableSuffix: string | undefined): Promise<void>;
    protected static buildTableName(tableName: string): Promise<void>;
}
