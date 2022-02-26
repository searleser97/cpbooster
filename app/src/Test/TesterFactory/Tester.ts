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
import Util from "../../Utils/Util";
import * as fs from "fs";
import { exit } from "process";
import chalk from "chalk";
import { spawnSync } from "child_process";
import * as Path from "path";

export default abstract class Tester {
  config: Config;
  filePath: string;
  langExtension: string;

  constructor(config: Config, filePath: string) {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      exit(0);
    }
    this.config = config;
    this.filePath = filePath;
    this.langExtension = Path.extname(this.filePath).slice(1).toLowerCase();
  }

  abstract testOne(testId: number, compile: boolean): Veredict;

  abstract debugOne(testId: number, compile: boolean): void;

  abstract debugWithUserInput(compile: boolean): void;

  testAll(compile: boolean): void {
    const testcasesIds = Tester.getTestCasesIds(this.filePath);
    if (testcasesIds.length == 0) {
      console.log("No testcases available for this file:", this.filePath);
      exit(0);
    }
    let veredict = this.testOne(testcasesIds[0], compile);
    if (veredict === Veredict.CE || veredict === Veredict.ERROR) {
      exit(0);
    }
    let acCnt = veredict === Veredict.AC || veredict === Veredict.AC_WHEN_TRIMMED ? 1 : 0;
    for (let i = 1; i < testcasesIds.length; i++) {
      veredict = this.testOne(testcasesIds[i], false);
      acCnt += veredict === Veredict.AC || veredict === Veredict.AC_WHEN_TRIMMED ? 1 : 0;
    }
    Tester.printScore(acCnt, testcasesIds.length);
  }

  extractTimeLimit(): number {
    const text = fs.readFileSync(this.filePath).toString();
    const commentString = Util.getCommentString(this.langExtension, this.config);
    const re = new RegExp(String.raw`^\s*${commentString}\s*time-limit\s*:\s*([0-9]+)\s*$`, "gm");
    const match = re.exec(text);
    let time = 3000; // Default time
    if (match) {
      time = parseInt(match[1]);
    }
    return time;
  }

  getFormattedVeredict(veredict: Veredict): string {
    switch (veredict) {
      case Veredict.AC:
      case Veredict.AC_WHEN_TRIMMED:
        return chalk.bgGreen(chalk.whiteBright(" A C "));
      case Veredict.WA:
        return chalk.bgRed(chalk.whiteBright(" W A "));
      case Veredict.RTE:
        return chalk.bgBlue(chalk.whiteBright(" R T E "));
      case Veredict.TLE:
        return chalk.bgHex("#8d42f5")(chalk.whiteBright(" T L E "));
      case Veredict.CE:
        return chalk.bgYellow(chalk.whiteBright(" Compilation Error "));
      default:
        return "UNDETERMINED";
    }
  }

  printTestResults(veredict: Veredict, feedback: string, testId: number): void {
    if (veredict !== Veredict.CE) {
      console.log(`Test Case ${testId}:`, this.getFormattedVeredict(veredict) + "\n");
      if (!this.config.hideTestCaseInput) {
        const input = fs.readFileSync(Tester.getInputPath(this.filePath, testId)).toString();
        console.log(`${chalk.bgWhite(chalk.black(" Input "))}\n`);
        if (this.config.maxLinesToShowFromInput === 0) {
          console.log(input + "\n");
        } else {
          const inputLines = input.split("\n");
          const reducedInputLines = [
            inputLines.slice(0, this.config.maxLinesToShowFromInput),
            "..."
          ].join("\n");
          console.log(reducedInputLines + "\n");
        }
      }
    } else {
      console.log(this.getFormattedVeredict(veredict) + "\n");
    }

    console.log(feedback);
  }

  protected runDebug(execCommand: string, args: string[], testId: number): void {
    console.log("Running Test Case", testId, "with debugging flags\n");
    const execution = spawnSync(
      execCommand,
      [...args, "<", `"${Tester.getInputPath(this.filePath, testId)}"`],
      { shell: true }
    );

    if (execution.stdout.toString()) {
      console.log(execution.stdout.toString());
    }

    if (execution.stderr.toString()) {
      console.log(
        Util.replaceAll(execution.stderr.toString(), "runtime error", chalk.red("runtime error"))
      );
    }
  }

  getTestVeredict(
    execCommand: string,
    args: string[],
    testId: number,
    hasValidConditions: () => { status: boolean; feedback: string },
    shouldCompile?: boolean,
    compile?: (isDebug: boolean) => { status: boolean; feedback: string }
  ): { veredict: Veredict; feedback: string } {
    let feedback = "";
    let finalVeredict = Veredict.UNDETERMINED;

    if (shouldCompile && compile) {
      const compilationState = compile(false);
      if (!compilationState.status) {
        return { veredict: Veredict.CE, feedback: compilationState.feedback };
      }
    }

    const preConditionState = hasValidConditions();

    if (!preConditionState.status) {
      feedback += preConditionState.feedback;
      finalVeredict = Veredict.ERROR;
    } else {
      const execution = spawnSync(execCommand, args, {
        input: fs.readFileSync(Tester.getInputPath(this.filePath, testId)),
        timeout: this.extractTimeLimit() + 500
      });
      // TODO: Extract logic of each condition to small functions
      if (execution.error?.message.includes("ETIMEDOUT")) {
        finalVeredict = Veredict.TLE;
      } else if (execution.status !== 0) {
        if (execution.stdout.toString()) feedback += execution.stdout.toString() + "\n";
        if (execution.stderr.toString()) feedback += execution.stderr.toString() + "\n";
        finalVeredict = Veredict.RTE;
      } else {
        const answerFilePath = Tester.getAnswerPath(this.filePath, testId);

        if (fs.existsSync(answerFilePath)) {
          const output = execution.stdout?.toString() ?? "";
          const ans = fs.readFileSync(answerFilePath).toString();
          const trimmedOutput = output.trim();
          const trimmedAns = ans.trim();
          const outputLines = trimmedOutput.split("\n");
          const ansLines = trimmedAns.split("\n");

          const trimmedOutputLines = outputLines.map((item) => {
            return item.trim(); // remove '\r' char if exists
          });
          const trimmedAnsLines = ansLines.map((item) => {
            return item.trim(); // remove '\r' char if exists
          });

          const isTrimmedOutputSame =
            trimmedOutputLines.length === trimmedAnsLines.length &&
            Util.sequence(0, trimmedAnsLines.length).every(
              (index) => trimmedOutputLines[index] === trimmedAnsLines[index]
            );

          if (isTrimmedOutputSame) {
            if (ans !== output) {
              feedback += chalk.yellow("Check leading and trailing blank spaces") + "\n\n";
              finalVeredict = Veredict.AC_WHEN_TRIMMED;
            } else {
              finalVeredict = Veredict.AC;
            }
            feedback += chalk.bgGreen(chalk.whiteBright(" Your Output ")) + "\n\n";
            feedback += output;
          } else {
            feedback += getOutputDiff(outputLines, ansLines);
            finalVeredict = Veredict.WA;
          }
        } else {
          feedback += `answer file not found in ${answerFilePath}\n`;
          finalVeredict = Veredict.RTE;
        }
        const outputFilePath = Tester.getOutputPath(this.filePath, testId);
        fs.writeFileSync(outputFilePath, execution.stdout.toString());
      }
    }
    return {
      veredict: finalVeredict,
      feedback
    };
  }

  protected runDebugWithUserInput(command: string, args: string[] = []): void {
    console.log("Running with debugging flags\n\nEnter your input manually\n");
    spawnSync(command, args, { stdio: "inherit" });
  }

  static getInputPath(filePath: string, testId: number): string {
    const filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
    return Util.normalizeFilePath(`${filePathNoExtension}.in${testId}`);
  }

  static getOutputPath(filePath: string, testId: number): string {
    const filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
    return Util.normalizeFilePath(`${filePathNoExtension}.out${testId}`);
  }

  static getAnswerPath(filePath: string, testId: number): string {
    const filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
    return Util.normalizeFilePath(`${filePathNoExtension}.ans${testId}`);
  }

  static getTestCasesIds(filePath: string): number[] {
    const parsedPath = Path.parse(filePath);
    let directoryPath = parsedPath.dir;
    if (directoryPath == "") directoryPath = ".";
    const fileNameNoExtension = parsedPath.name;
    const testcasesFiles = fs
      .readdirSync(directoryPath)
      .filter((fileName) => fileName.startsWith(`${fileNameNoExtension}.in`));
    const testcasesIds: number[] = [];
    testcasesFiles.forEach((filename) => {
      const num = parseInt(filename.replace(`${fileNameNoExtension}.in`, ""));
      testcasesIds.push(num);
    });
    return testcasesIds;
  }

  /**
   * @param {string} filePath path to the source code file
   * @returns the id with maximum numeric value from all the
   * test cases that correspond to `filePath`
   */
  static getMaxTestCaseId(filePath: string): number {
    const testCasesIds = Tester.getTestCasesIds(filePath);
    return testCasesIds.length === 0 ? 0 : Math.max(...testCasesIds);
  }

  /**
   * Computes the unique Id of a testcase that does not exist yet,
   * useful to know what will be the id of the next new testcase
   * before actually creating it.
   * @param {string} filePath path to the source code file
   * @returns the id of the next testcase
   */
  static getNextTestCaseId(filePath: string): number {
    return Tester.getMaxTestCaseId(filePath) + 1;
  }

  static async createTestCase(filePath: string): Promise<void> {
    const thisTCId = Tester.getNextTestCaseId(filePath);
    console.log("\nPress ctrl+D to finish your input\n");
    console.log("Test Case Input:\n");
    const input = await Util.readToEOF();
    console.log("\nTest Case Correct Output:\n");
    const answer = await Util.readToEOF();
    fs.writeFileSync(Tester.getInputPath(filePath, thisTCId), input);
    fs.writeFileSync(Tester.getAnswerPath(filePath, thisTCId), answer);
    console.log("\nTest case", thisTCId, "written.");
  }

  static printScore(ac: number, total: number): void {
    const plainmsg = `| ${ac.toString()} / ${total} AC |`;
    let msg = `| ${ac.toString()} / ${total} ${chalk.greenBright("AC")} |`;
    if (ac == total) msg += " 🎉🎉🎉";
    const summary = "Summary: ";
    console.log();
    console.log(Util.repeat(" ", summary.length) + Util.repeat("+", plainmsg.length));
    console.log(summary + msg);
    console.log(Util.repeat(" ", summary.length) + Util.repeat("+", plainmsg.length));
    console.log();
  }

  static printCompilationErrorMsg(): void {
    console.log(chalk.bgYellow(chalk.whiteBright(" Compilation Error ")), "\n");
  }

  protected getSegmentedCommand(langExtension: string, debug: boolean): string[] {
    const langConfig = this.config.languages[langExtension];

    if (langConfig) {
      let segmentedCommand: string[];
      if (debug) {
        segmentedCommand = langConfig.debugCommand.split(" ");
      } else {
        segmentedCommand = langConfig.command.split(" ");
      }
      // TODO: log message and exit(0) when segmentedCommand is empty
      return segmentedCommand;
    } else {
      console.log(
        `${
          debug ? "debug " : ""
        }command not specified in cpbooster-config.json for ${langExtension} files`
      );
      exit(0);
    }
  }

  protected getCompilerCommand(langExtension: string, debug: boolean): string {
    return this.getSegmentedCommand(langExtension, debug)[0];
  }
}

function getOutputDiff(trimmedOutputLines: string[], trimmedAnsLines: string[]) {
  let outputDiff = "";
  let maxOutputWidth = 0;
  for (let i = 0; i < trimmedOutputLines.length; i++) {
    if (trimmedOutputLines[i].length > maxOutputWidth) {
      maxOutputWidth = trimmedOutputLines[i].length;
    }
  }
  const columnWidth = Math.min(Math.max(maxOutputWidth, 16), process.stdout.columns - 8);
  const leftHeader = chalk.bgRed(chalk.whiteBright(Util.padCenter("Your Output", columnWidth)));
  const rightHeader = chalk.bgGreen(
    chalk.whiteBright(Util.padCenter("Correct Answer", columnWidth))
  );
  outputDiff += leftHeader + "|" + rightHeader + "\n";
  outputDiff += "".padEnd(columnWidth) + "|" + "".padEnd(columnWidth) + "\n";
  for (let i = 0; i < Math.max(trimmedOutputLines.length, trimmedAnsLines.length); i++) {
    let line = "";
    if (i < trimmedOutputLines.length) {
      line += trimmedOutputLines[i].padEnd(columnWidth) + "|";
    } else {
      line += "".padEnd(columnWidth) + "|";
    }

    if (i < trimmedAnsLines.length) {
      line += trimmedAnsLines[i].padEnd(columnWidth);
    } else {
      line += "".padEnd(columnWidth);
    }

    if (
      i < trimmedOutputLines.length &&
      i < trimmedAnsLines.length &&
      trimmedOutputLines[i] === trimmedAnsLines[i]
    ) {
      line += chalk.bgGreen("  ");
    } else {
      line += chalk.bgRed("  ");
    }

    outputDiff += line + "\n";
  }
  return outputDiff + "\n";
}
