import ITester from "./ITester";
import Config from "../Config";
import * as Path from "path";
import * as fs from "fs";
import chalk from "chalk";
import Util from "../Util";
import { spawnSync } from "child_process";
import { exit } from "process";

export default class CppTester implements ITester {
    config: Config;
    filePath: string;

    constructor(config: Config, filePath: string) {
        this.config = config;
        this.filePath = filePath;
    }

    getNameForBinary(debug: boolean): string | undefined {
        let segmentedCommand: string[];
        if (debug) {
            segmentedCommand = this.config.cppDebugCommand.split(" ");
        } else {
            segmentedCommand = this.config.cppCompileCommand.split(" ");
        }

        for (let i = 0; i < segmentedCommand.length; i++) {
            if (segmentedCommand[i] == "-o") {
                return segmentedCommand[i + 1];
            }
        }
        return undefined;
    }

    getDefaultBinaryName(debug: boolean): string {
        let defaultName = Util.replaceAll(Path.parse(this.filePath).name, " ", "");
        if (debug) defaultName += "debug";
        defaultName += ".exe";
        return defaultName;
    }

    compile(debug: boolean) {
        console.log("Compiling...\n");
        let segmentedCommand: string[];
        if (debug) {
            segmentedCommand = this.config.cppDebugCommand.split(" ");
        } else {
            segmentedCommand = this.config.cppCompileCommand.split(" ");
        }
        let args = [...segmentedCommand.slice(1), this.filePath];
        let compileCommand = segmentedCommand[0];

        if (!this.getNameForBinary(debug)) {
            args.push("-o", this.getDefaultBinaryName(debug));
        }

        let compilation = spawnSync(compileCommand, args);

        if (compilation.stderr) {
            let compileStderr = Buffer.from(compilation.stderr).toString("utf8").trim();
            if (compileStderr !== "") {
                compileStderr = compileStderr.split("error").join(chalk.redBright("error"));
                compileStderr = compileStderr.split("warning").join(chalk.blueBright("warning"));
                if (compileStderr.includes("error")) {
                    console.log(chalk.bgYellow(chalk.whiteBright(" Compilation Error ")), "\n");
                }
                console.log(compileStderr);
                if (compileStderr.includes("error")) exit(0);
            }
        }
    }

    testOne(testId: number, compile: boolean): void {
        let binaryFileName = this.getNameForBinary(false);
        if (!binaryFileName) binaryFileName = this.getDefaultBinaryName(false);
        let binaryFilePath = `.${Path.sep}${binaryFileName}`;
        if (compile) {
            this.compile(false);
        } else if (!fs.existsSync(binaryFilePath)) {
            console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
            exit(0);
        }
        Util.runTest(binaryFilePath, [], this.filePath, testId);
    }

    testAll(compile: boolean): void {
        if (compile) this.compile(false);
        let testcasesIds = Util.getTestCasesIdsForFile(this.filePath);
        for (let i = 0; i < testcasesIds.length; i++) {
            this.testOne(testcasesIds[i], false);
        }
    }

    debugOne(testId: number, compile: boolean): void {
        let binaryFileName = this.getNameForBinary(true);
        if (!binaryFileName) binaryFileName = this.getDefaultBinaryName(true);
        let binaryFilePath = `.${Path.sep}${binaryFileName}`;
        if (compile) {
            this.compile(true);
        } else if (!fs.existsSync(binaryFilePath)) {
            console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
            exit(0);
        }
        Util.runDebug(binaryFilePath, [], this.filePath, testId);
    }

    debugWithUserInput(compile: boolean): void {
        let binaryFileName = this.getNameForBinary(true);
        if (!binaryFileName) binaryFileName = this.getDefaultBinaryName(true);
        let binaryFilePath = `.${Path.sep}${binaryFileName}`;
        if (compile) {
            this.compile(true);
        } else if (!fs.existsSync(binaryFilePath)) {
            console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
            exit(0);
        }
        Util.runDebugWithUserInput(binaryFilePath);
    }
}
