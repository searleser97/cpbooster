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
import * as fs from "fs";
import * as Path from "path";
import * as os from "os";
import Config from "../Config/Config";
import Util from "../Utils/Util";
import { buildLaunchCommand } from './BuildLaunchCommand';
import chalk from "chalk";
import { spawn, spawnSync } from "child_process";
import { exit } from "process";

export default class SourceFileCreator {
  static create(filePath: string, config: Config, timeLimitInMS = 3000, problemUrl?: string): void {
    const absoluteFilePath = Path.isAbsolute(filePath) 
      ? filePath 
      : Path.resolve(process.cwd(), filePath);
    const fileDirectory = Path.dirname(absoluteFilePath);
    if (!fs.existsSync(fileDirectory)) {
    	console.error(
    	  chalk.red(
			`The specified directory does not exist: ${fileDirectory}`
		  )
		);
    	exit(1);
	}

    const filename = Path.basename(filePath);
    const match = /\{[a-zA-Z](\.{2,}|-)[a-zA-Z]\}\.[a-zA-Z0-9]+/g.exec(filename);
    if (match) {
      const idx = match[0].indexOf("}");
      this.createMultiple(
        absoluteFilePath,
        config,
        match[0][1],
        match[0][idx - 1],
        timeLimitInMS,
        problemUrl
      );
    } else {
      this.createSingle(absoluteFilePath, config, timeLimitInMS, problemUrl);
    }

    const command = buildLaunchCommand(config.editor, absoluteFilePath);
    const isWindows = os.type() === "Windows_NT" || os.release().includes("Microsoft");
    if (command) {
      const newTerminalExec = spawn(command, { shell: true, detached: true, stdio: "ignore" });
      newTerminalExec.unref();
      if (config.closeAfterClone && !isWindows) {
        const execution = spawnSync("ps", ["-o", "ppid=", "-p", `${process.ppid}`]);
        const grandParentPid = parseInt(execution.stdout.toString().trim());
        if (!Number.isNaN(grandParentPid)) {
          process.kill(grandParentPid, "SIGKILL");
        }
      }
    } else {
      console.log(
        chalk.yellow(
          "The terminal specified in the configuration " +
            "file is not fully supported yet, you will have to change your directory manually\n"
        )
      );
    }
  }

  static createSingle(
    filePath: string,
    config: Config,
    timeLimitInMS = 3000,
    problemUrl?: string
  ): void {
    const langExtension = Util.getExtensionName(filePath);
    const filename = Util.normalizeFileName(Path.basename(filePath));
    filePath = Path.join(Path.dirname(filePath), filename);
    let template = "";
    const commentString = Util.getCommentString(langExtension, config);
    if (commentString) {
      template += `${commentString} time-limit: ${timeLimitInMS}\n`;
      if (problemUrl) {
        template += `${commentString} problem-url: ${problemUrl}\n`;
      }
    }
    const langConfig = config.languages[langExtension];
    if (langConfig?.template) {
      template += fs.readFileSync(langConfig.template).toString();
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, template);
      console.info("Source file", filename, "created.");
    } else {
      console.info("Source file", filename, "already existed.");
    }
  }

  static createMultiple(
    filePath: string,
    config: Config,
    start: string,
    end: string,
    timeLimitInMS = 3000,
    problemUrl?: string
  ): void {
    if (start.length != 1 || end.length != 1) {
      throw new Error("incorrect format of start or end, it should be a single character");
    }
    const dirname = Path.dirname(filePath);
    const extension = Path.extname(filePath);
    const filePaths: string[] = [];
    let startCode = start.toLowerCase().charCodeAt(0);
    let endCode = end.toLowerCase().charCodeAt(0);
    if (endCode < startCode) {
      [startCode, endCode] = [endCode, startCode];
    }
    for (let i = startCode; i <= endCode; i++) {
      filePaths.push(Path.join(dirname, String.fromCharCode(i) + extension));
    }
    for (filePath of filePaths) {
      SourceFileCreator.createSingle(filePath, config, timeLimitInMS, problemUrl);
    }
  }
}
