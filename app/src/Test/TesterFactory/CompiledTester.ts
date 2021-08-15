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

import Config from "../../Config/Config";
import * as Path from "path";
import * as fs from "fs";
import chalk from "chalk";
import Util from "../../Utils/Util";
import { spawnSync } from "child_process";
import { exit } from "process";
import { Veredict } from "../../Types/Veredict";
import Tester from "./Tester";

// Todo: If the list increases significantly, creating a Set containing
// the enum values would be reasonable for quick access.
export enum NonStandardCompilers {
  mcs = "mcs",
  csc = "csc"
}

export default class CompiledTester extends Tester {
  private static fileNameOptionForCommand: Map<string, string> = new Map([
    [NonStandardCompilers.mcs, "-out:"], // csharp compiler
    [NonStandardCompilers.csc, "/out:"] // csharp compiler
  ]);

  constructor(config: Config, filePath: string) {
    super(config, filePath);
  }

  testOne(testId: number, compile: boolean): Veredict {
    const binaryFileName = this.getExecutableFileNameOrDefault(false);
    const binaryFilePath = `.${Path.sep}${binaryFileName}`;
    if (compile) {
      this.compile(false);
    } else if (!fs.existsSync(binaryFilePath)) {
      console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
      exit(0);
    }
    return this.runTest(binaryFilePath, [], testId);
  }

  debugOne(testId: number, compile: boolean): void {
    const binaryFileName = this.getExecutableFileNameOrDefault(true);
    const binaryFilePath = `.${Path.sep}${binaryFileName}`;
    if (compile) {
      this.compile(true);
    } else if (!fs.existsSync(binaryFilePath)) {
      console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
      exit(0);
    }
    this.runDebug(binaryFilePath, [], testId);
  }

  debugWithUserInput(compile: boolean): void {
    const binaryFileName = this.getExecutableFileNameOrDefault(true);
    const binaryFilePath = `.${Path.sep}${binaryFileName}`;
    if (compile) {
      this.compile(true);
    } else if (!fs.existsSync(binaryFilePath)) {
      console.log(chalk.red("Error:"), `Executable ${binaryFilePath} not found`);
      exit(0);
    }
    this.runDebugWithUserInput(binaryFilePath);
  }

  getExecutableFileName(debug: boolean): string | undefined {
    const segmentedCommand = this.getSegmentedCommand(this.langExtension, debug);
    const compilerCommand = this.getCompilerCommand(this.langExtension, debug);
    const fileNameOption = CompiledTester.getFileNameOptionForCompilerCommand(compilerCommand);

    for (let i = 0; i < segmentedCommand.length; i++) {
      if (segmentedCommand[i].startsWith(fileNameOption)) {
        if (Object.keys(NonStandardCompilers).includes(compilerCommand)) {
          // using pop to reduce amount of code to return the last element
          return segmentedCommand[i].split(":").pop();
        } else {
          return segmentedCommand[i + 1];
        }
      }
    }
    return undefined;
  }

  getDefaultExecutableFileName(debug: boolean): string {
    let defaultName = Util.replaceAll(Path.parse(this.filePath).name, " ", "");
    if (debug) defaultName += "debug";
    defaultName += ".exe";
    return defaultName;
  }

  getExecutableFileNameOrDefault(debug: boolean): string {
    return this.getExecutableFileName(debug) ?? this.getDefaultExecutableFileName(debug);
  }

  static getFileNameOptionForCompilerCommand(compilerCommand: string): string {
    return CompiledTester.fileNameOptionForCommand.get(compilerCommand) ?? "-o";
  }

  static printCompilingMsg(): void {
    console.log("Compiling...\n");
  }

  static executeCompilation(compilerCommand: string, args: string[]): void {
    const compilation = spawnSync(compilerCommand, args);

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

  compile(debug: boolean): void {
    CompiledTester.printCompilingMsg();
    const segmentedCommand = this.getSegmentedCommand(this.langExtension, debug);

    const args = [...segmentedCommand.slice(1)];
    const compilerCommand = this.getCompilerCommand(this.langExtension, debug);

    if (!this.getExecutableFileName(debug)) {
      if (Object.keys(NonStandardCompilers).includes(compilerCommand)) {
        args.push(
          CompiledTester.getFileNameOptionForCompilerCommand(compilerCommand) +
            this.getDefaultExecutableFileName(debug)
        );
      } else {
        args.push(
          CompiledTester.getFileNameOptionForCompilerCommand(compilerCommand),
          this.getDefaultExecutableFileName(debug)
        );
      }
    }

    args.push(this.filePath);

    CompiledTester.executeCompilation(compilerCommand, args);
  }
}
