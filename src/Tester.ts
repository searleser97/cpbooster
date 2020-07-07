import Config from "./Config";
import { spawnSync } from "child_process";
import * as Path from "path";
import * as fs from "fs";

export default class Tester {
    config: Config;
    filePath: string;
    fileExtension: string | undefined;
    filePathNoExtension: string;
    directoryPath: string;
    fileNameNoExtension: string;
    binaryFilePath: string;
    compileCommand: string;
    compileArgs: string[];

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
        if (this.directoryPath == ".") {
            this.binaryFilePath = `.${Path.sep}${this.getNameForBinary(this.compileArgs)}`;
        } else {
            this.binaryFilePath = Path.join(
                this.directoryPath,
                this.getNameForBinary(this.compileArgs)
            );
        }

        console.log("filepath:", this.filePath);
        console.log("extension:", this.fileExtension);
        console.log("filepathnoextension:", this.filePathNoExtension);
        console.log("directorypath:", this.directoryPath);
        console.log("fileNameNoExtension:", this.fileNameNoExtension);
        console.log("binaryFilePath:", this.binaryFilePath);
        console.log("compileCommand:", this.compileCommand);
        console.log("compileArgs:", this.compileArgs);
    }

    compile() {
        let compilation = spawnSync(this.compileCommand, this.compileArgs);
        if (compilation.stderr) {
            let compileStderr = Buffer.from(compilation.stderr).toString("utf8");
            console.log(compileStderr);
            // IF stderr has real error, print it and inmediately exit the whole program.
        }
        if (compilation.stdout) {
            let compileStdout = Buffer.from(compilation.stdout).toString("utf8");
            console.log(compileStdout);
        }
    }

    run(requiresCompilation: boolean, testId?: number | undefined) {
        if (requiresCompilation) this.compile();
        if (testId) {
            this.runSingle(testId);
        } else {
            this.runAll();
        }
    }

    runAll() {
        var testcasesFiles = fs
            .readdirSync(this.directoryPath)
            .filter((fileName) => fileName.startsWith(`${this.fileNameNoExtension}.in`));
        console.log(testcasesFiles);
    }

    runSingle(testId: number) {
        let testCasePath = `${this.filePathNoExtension}.in${testId}`;
        let outputPath = `${this.filePathNoExtension}.out${testId}`;
        let ansPath = `${this.filePathNoExtension}.ans${testId}`;
        let executionArgs = ["<", testCasePath, ">", outputPath];
        let execution = spawnSync(this.binaryFilePath, executionArgs);
        // let the terminal handle the error if binaryFilePath does not exist.
        if (execution.stdout) {
            let executionStdout = Buffer.from(execution.stdout).toString("utf8");
            console.log(executionStdout);
        }
        if (execution.stderr) {
            let executionStderr = Buffer.from(execution.stderr).toString("utf8");
            console.log(executionStderr);
        }

        

    }

    debug(testId?: number | undefined) {
        if (testId) {
            this.debugSingle(testId, false);
        } else {
            this.debugAll();
        }
    }

    debugAll() {}

    debugSingle(testId: number, requiresCompilation: boolean = true) {
        console.log(testId);
    }

    getNameForBinary(args: string[]): string {
        for (let i = 0; i < args.length; i++) {
            if (args[i] == "-o") {
                return args[i + 1];
            }
        }
        return this.fileNameNoExtension.replace(/\s+/g, "_") + ".exe";
    }
}
