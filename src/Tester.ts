/*
    cpbooster "Competitive Programming Booster"
    Copyright (C) 2020  Sergio G. Sanchez V.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import Config from "./Config";
import { spawnSync, SpawnSyncReturns } from "child_process";
import * as Path from "path";
import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";

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

    compile(debug?: boolean | undefined | null) {
        let compilation: SpawnSyncReturns<string>;
        console.log("Compiling...\n");
        if (debug) {
            compilation = spawnSync(this.debugCommand, this.debugArgs);
        } else {
            compilation = spawnSync(this.compileCommand, this.compileArgs);
        }

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

    run(
        requiresCompilation: boolean,
        debug?: boolean | undefined | null,
        testId?: number | undefined | null
    ) {
        if (requiresCompilation) this.compile(debug);
        if (testId) {
            if (debug) {
                this.runSingle(testId, this.debugBinaryFilePath, true);
            } else {
                this.runSingle(testId, this.binaryFilePath, false);
            }
        } else {
            this.runAll(debug);
        }
    }

    runAll(debug?: boolean | undefined | null) {
        var testcasesFiles = fs
            .readdirSync(this.directoryPath)
            .filter((fileName) => fileName.startsWith(`${this.fileNameNoExtension}.in`));
        if (testcasesFiles.length === 0) {
            console.log("No testcases available");
            return;
        }
        testcasesFiles.forEach((filename) => {
            let num = parseInt(filename.replace(`${this.fileNameNoExtension}.in`, ""));
            this.runSingle(num, this.binaryFilePath, debug);
        });
    }

    runSingle(testId: number, binaryFilePath: string, debug?: boolean | undefined | null) {
        if (!fs.existsSync(binaryFilePath)) {
            console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
            return;
        }
        let testCasePath = `${this.filePathNoExtension}.in${testId}`;
        let outputPath = `${this.filePathNoExtension}.out${testId}`;
        let ansPath = `${this.filePathNoExtension}.ans${testId}`;
        let executionArgs: string[];
        if (debug) {
            executionArgs = ["<", `"${testCasePath}"`];
        } else {
            executionArgs = ["<", `"${testCasePath}"`, ">", `"${outputPath}"`];
        }
        let execution = spawnSync(binaryFilePath, executionArgs, { shell: true });
        if (execution.stdout) {
            let executionStdout = Buffer.from(execution.stdout).toString("utf8");
            if (executionStdout !== "") console.log(executionStdout);
        }
        if (execution.stderr) {
            let executionStderr = Buffer.from(execution.stderr).toString("utf8");
            if (executionStderr !== "") {
                if (!debug) {
                    console.log(
                        `Test Case ${testId}:`,
                        chalk.bgBlue(chalk.whiteBright(" R T E ")),
                        "\n"
                    );
                }
                console.log(executionStderr);
                return;
            }
        }

        if (debug) return;

        if (!fs.existsSync(ansPath) || !fs.existsSync(outputPath)) return;

        let ans = fs.readFileSync(ansPath).toString();
        let output = fs.readFileSync(outputPath).toString();

        if (ans.trim() === output.trim()) {
            console.log(`Test Case ${testId}:`, chalk.bgGreen(chalk.whiteBright(" A C ")), "\n");
            if (ans !== output)
                console.log(chalk.yellow("Check leading and trailing blank spaces"));
        } else {
            console.log(`Test Case ${testId}:`, chalk.bgRed(chalk.whiteBright(" W A ")), "\n");
            let outputLines = output.split("\n");
            let ansLines = ans.split("\n");
            let maxOutputWidth = 0;
            for (let i = 0; i < outputLines.length; i++) {
                if (outputLines[i].length > maxOutputWidth) maxOutputWidth = outputLines[i].length;
            }
            let leftLimit = Math.min(Math.max(maxOutputWidth, 15), process.stdout.columns - 8);
            console.log(
                chalk.bgRed(chalk.whiteBright("Your output:".padEnd(leftLimit) + "|")) +
                    chalk.bgGreen(chalk.whiteBright("|Correct Answer:\n"))
            );
            for (let i = 0; i < Math.max(outputLines.length, ansLines.length); i++) {
                let line = "";
                if (i < outputLines.length) {
                    line += outputLines[i].padEnd(leftLimit) + "||";
                } else {
                    line += "".padEnd(leftLimit) + "||";
                }
                if (i < ansLines.length) {
                    line += ansLines[i];
                }
                console.log(line);
            }
            console.log();
        }
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
}
