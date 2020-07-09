import ITester from "./ITester";
import Config from "../Config";
import * as Path from "path";

export default class CppTester implements ITester {
    config: Config;
    filePath: string;
    fileExtension: string | undefined;
    filePathNoExtension: string;
    directoryPath: string;
    fileNameNoExtension: string;
    binaryFilePath: string;
    compileCommand: string;
    compileArgs: string[];
    debugCommand: string;
    debugArgs: string[];
    debugBinaryFilePath: string;

    constructor(config: Config, filePath: string) {
        this.config = config;
        this.filePath = filePath;
        this.filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
        this.fileExtension = filePath.substring(filePath.lastIndexOf(".") + 1);
        this.directoryPath = filePath.substring(0, filePath.lastIndexOf(Path.sep));
        if (this.directoryPath == "") this.directoryPath = ".";
        this.fileNameNoExtension = filePath.substring(
            filePath.lastIndexOf(Path.sep) + 1,
            filePath.lastIndexOf(".")
        );

        let segmentedCommand = this.config.cppCompileCommand.split(" ");
        this.compileCommand = segmentedCommand[0];
        this.compileArgs = [...segmentedCommand.slice(1), this.filePath];
        this.binaryFilePath = `.${Path.sep}${this.getNameForBinary(this.compileArgs)}`;

        segmentedCommand = this.config.cppDebugCommand.split(" ");
        this.debugCommand = segmentedCommand[0];
        this.debugArgs = [...segmentedCommand.slice(1), this.filePath];
        this.debugBinaryFilePath = `.${Path.sep}${this.getNameForBinary(this.debugArgs)}`;
    }

    getNameForBinary(args: string[]): string {
        for (let i = 0; i < args.length; i++) {
            if (args[i] == "-o") {
                return args[i + 1];
            }
        }
        let defaultName = this.fileNameNoExtension.replace(/\s+/g, "_") + ".exe";
        args.push("-o", defaultName);
        return defaultName;
    }

    testOne(id: number): void {
        throw new Error("Method not implemented.");
    }
    testAll(): void {
        throw new Error("Method not implemented.");
    }
    debugOne(id: number): void {
        throw new Error("Method not implemented.");
    }
    debugAll(): void {
        throw new Error("Method not implemented.");
    }
}