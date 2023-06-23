import * as yargs from "yargs";
/**
 * Create migration command.
 */
export declare class MigrationCreateCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        "table-suffix": unknown;
    } & {
        table: unknown;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
    protected static getTemplate(name: string): string;
    protected static getTemplateFull(name: string): string;
}
