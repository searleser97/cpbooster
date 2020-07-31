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
import Config from "../Config";
import * as Path from "path";
import * as fs from "fs";
import chalk from "chalk";
import Util from "../Util";
import { spawnSync } from "child_process";
import { exit } from "process";
import { Veredict } from "../Veredict";
import Tester from "./Tester";

export default class CppTester extends Tester {

    constructor(config: Config, filePath: string) {
        super(config, filePath);
    }

    testOne(testId: number, compile: boolean): Veredict {
        let binaryFileName = this.getNameForBinary(false);
        if (!binaryFileName) binaryFileName = this.getDefaultBinaryName(false);
        let binaryFilePath = `.${Path.sep}${binaryFileName}`;
        if (compile) {
            this.compile(false);
        } else if (!fs.existsSync(binaryFilePath)) {
            console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
            exit(0);
        }
        return this.runTest(binaryFilePath, [], testId);
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
        this.runDebug(binaryFilePath, [], testId);
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
        this.runDebugWithUserInput(binaryFilePath);
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
                    Tester.printCompilationErrorMsg();
                }
                console.log(compileStderr);
                if (compileStderr.includes("error")) exit(0);
            }
        }
    }

}
