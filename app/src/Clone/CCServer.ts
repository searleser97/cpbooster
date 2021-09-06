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

import express from "express";
import * as fs from "fs";
import * as Path from "path";
import ProblemData from "../Types/ProblemData";
import Config from "../Config/Config";
import { exit } from "process";
import { spawn, spawnSync } from "child_process";
import Util from "../Utils/Util";
import SourceFileCreator from "../Create/SourceFileCreator";
import * as os from "os";
import { getEditorCommand } from "./EditorCommandBuilder";
import chalk from "chalk";
import Tester from "../Test/TesterFactory/Tester";

/* Competitive Companion Server */
export default class CCServer {
  app = express();
  contestName = "NO_NAME";
  config: Config;
  isActive = false;
  lastRequestTime = process.hrtime();
  constructor(config: Config) {
    this.config = config;
    this.app.use(express.json());
    this.app.post("/", (request, response) => {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("OK");

      const problemData: ProblemData = request.body;
      problemData.name = Util.normalizeFileName(problemData.name);
      problemData.group = Util.normalizeFileName(problemData.group);

      this.contestName = problemData.group;
      const contestPath = Path.join(config.contestsDirectory, problemData.group);
      if (!fs.existsSync(contestPath)) fs.mkdirSync(contestPath, { recursive: true });
      const FilesPathNoExtension = `${Path.join(contestPath, problemData.name)}`;
      const extension = `.${config.preferredLang}`;
      const filePath = `${FilesPathNoExtension}${extension}`;
      SourceFileCreator.create(filePath, config, problemData.timeLimit, problemData.url);
      problemData.tests.forEach((testcase, idx) => {
        fs.writeFileSync(Tester.getInputPath(filePath, idx + 1), testcase.input);
        fs.writeFileSync(Tester.getAnswerPath(filePath, idx + 1), testcase.output);
      });
      const tcLen = problemData.tests.length;
      console.log(`-> ${problemData.tests.length} Testcase${tcLen == 1 ? "" : "s"}`);
      console.log("-------------");
      if (!this.isActive) this.isActive = true;
      this.lastRequestTime = process.hrtime();
    });
  }

  run(): void {
    if (!this.config.preferredLang) {
      console.log("Missing preferred language (preferredLang) key in configuration");
      exit(0);
    }
    const serverRef = this.app.listen(this.config.port, () => {
      console.info("\nserver running at port:", this.config.port);
      console.info('\nserver waiting for "Competitive Companion Plugin" to send problems...\n');
    });

    const interval = setInterval(() => {
      if (!this.isActive) return;
      const elapsedTime = process.hrtime(this.lastRequestTime)[0];
      const isWindows = os.type() === "Windows_NT" || os.release().includes("Microsoft");
      const tolerance = isWindows ? 10 : 1;
      if (elapsedTime >= tolerance) {
        if (serverRef) serverRef.close();
        clearInterval(interval);
        const contestPath = Path.join(this.config.contestsDirectory, this.contestName);
        console.log("\n\t    DONE!\n");
        console.log(`The path to your contest folder is: "${contestPath}"`);
        console.log("\n\tHappy Coding!\n");
        const command = getEditorCommand(this.config.editor, contestPath);
        if (command) {
          const newTerminalExec = spawn(command, { shell: true, detached: true, stdio: "ignore" });
          newTerminalExec.unref();
          if (this.config.closeAfterClone && !isWindows) {
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
        exit(0);
      }
    }, 100);
  }
}
