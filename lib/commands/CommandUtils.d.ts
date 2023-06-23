export declare class CommandUtils {
    /**
     * Creates directories recursively.
     */
    static createDirectories(directory: string): void;
    /**
     * Creates a file with the given content in the given path.
     */
    static createFile(filePath: string, content: string, override?: boolean): Promise<void>;
}
