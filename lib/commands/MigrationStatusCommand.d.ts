import * as yargs from 'yargs';
/**
 * Runs migration command.
 */
export declare class MigrationStatusCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        tableSuffix: unknown;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
    protected static resolveTableName(databasePath: string, tableFile: string, tableSuffix: string | undefined): any;
    protected static buildTableName(tableName: string): Promise<void>;
}
