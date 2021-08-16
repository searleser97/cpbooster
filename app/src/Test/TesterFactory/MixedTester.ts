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
import { Veredict } from "../../Types/Veredict";
import Tester from "./Tester";
import chalk from "chalk";
import * as Path from "path";
import * as fs from "fs";
import { exit } from "process";
import CompiledTester from "./CompiledTester";
import { LangExtensions } from "Utils/LangExtensions";

export default class MixedTester extends Tester {
  constructor(config: Config, filePath: string) {
    super(config, filePath);
  }

  getExecutableFileName(): string {
    return `${this.getExecutableFileNameNoExtension()}${
      this.langExtension === LangExtensions.kotlin ? "Kt" : ""
    }.class`;
  }

  getExecutableFileNameNoExtension(): string {
    return (
      Path.basename(this.filePath).replace(`.${this.langExtension}`, "") +
      (this.langExtension === LangExtensions.kotlin ? "Kt" : "")
    );
  }

  testOne(testId: number, compile: boolean): Veredict {
    const executableFileName = this.getExecutableFileName();
    if (compile) {
      this.compile(false);
    } else if (!fs.existsSync(executableFileName)) {
      console.log(
        chalk.red("Error:"),
        `Executable ${executableFileName} not found, Is your class name same as the file name ?`
      );
      exit(0);
    }
    const langConfig = this.config.languages[this.langExtension];
    if (langConfig?.runCommand) {
      const segmentedRunCommand = langConfig.runCommand.split(" ");
      segmentedRunCommand.push(this.getExecutableFileNameNoExtension());
      return this.runTest(segmentedRunCommand[0], segmentedRunCommand.slice(1), testId);
    } else {
      console.log(`runCommand not specified for ${this.langExtension} files`);
      exit(0);
    }
  }

  compile(debug: boolean): void {
    CompiledTester.printCompilingMsg();
    const segmentedCommand = this.getSegmentedCommand(this.langExtension, debug);

    const args = segmentedCommand.slice(1);
    const compilerCommand = this.getCompilerCommand(this.langExtension, debug);

    args.push(this.filePath);

    CompiledTester.executeCompilation(compilerCommand, args);
  }

  debugOne(testId: number, compile: boolean): void {
    const executableFileName = this.getExecutableFileName();
    if (compile) {
      this.compile(true);
    } else if (!fs.existsSync(executableFileName)) {
      console.log(
        chalk.red("Error:"),
        `Executable ${executableFileName} not found, Is your class name same as the file name?`
      );
      exit(0);
    }
    const langConfig = this.config.languages[this.langExtension]!;
    if (langConfig.runCommand) {
      const segmentedRunCommand = langConfig.runCommand.split(" ");
      segmentedRunCommand.push(this.getExecutableFileNameNoExtension());
      return this.runDebug(segmentedRunCommand[0], segmentedRunCommand.slice(1), testId);
    } else {
      console.log(`runCommand not specified for ${this.langExtension} files`);
      exit(0);
    }
  }

  debugWithUserInput(compile: boolean): void {
    const executableFileName = this.getExecutableFileName();
    if (compile) {
      this.compile(true);
    } else if (!fs.existsSync(executableFileName)) {
      console.log(
        chalk.red("Error:"),
        `Executable ${executableFileName} not found, Is your class name same as the file name?`
      );
      exit(0);
    }
    const langConfig = this.config.languages[this.langExtension]!;
    if (langConfig.runCommand) {
      const segmentedRunCommand = langConfig.runCommand.split(" ");
      segmentedRunCommand.push(this.getExecutableFileNameNoExtension());
      return this.runDebugWithUserInput(segmentedRunCommand[0], segmentedRunCommand.slice(1));
    } else {
      console.log(`runCommand not specified for ${this.langExtension} files`);
      exit(0);
    }
  }
}
