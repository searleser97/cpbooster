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
import chalk from "chalk";
import * as Path from "path";
import { exit } from "process";
import { spawnSync, spawn, exec } from "child_process";
import { createInterface } from "readline";
import { once } from "events";
import { Veredict } from "./Veredict";

export default class Util {
    static replaceAll(text: string, oldString: string, newString: string): string {
        return text.split(oldString).join(newString);
    }

    static printTestResults(outputFilePath: string, answerFilePath: string, testId: number): Veredict {
        if (!fs.existsSync(outputFilePath)) {
            console.log("output file not found in", outputFilePath);
            return Veredict.RTE;
        }
        if (!fs.existsSync(answerFilePath)) {
            console.log("answer file not found in", answerFilePath);
            return Veredict.RTE;
        }
        let ans = fs.readFileSync(answerFilePath).toString();
        let output = fs.readFileSync(outputFilePath).toString();

        if (ans.trim() === output.trim()) {
            console.log(`Test Case ${testId}:`, chalk.bgGreen(chalk.whiteBright(" A C ")), "\n");
            if (ans !== output)
                console.log(chalk.yellow("Check leading and trailing blank spaces") + "\n");
            console.log(chalk.bgGreen(chalk.whiteBright("Your Output:")) + "\n");
            console.log(output);
            return Veredict.AC;
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
                chalk.bgRed(chalk.whiteBright("Your Output:".padEnd(leftLimit) + "|")) +
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
                    line += ansLines[i].padEnd(leftLimit);
                } else {
                    line += "".padEnd(leftLimit);
                }

                if (i < outputLines.length && i < ansLines.length && outputLines[i] === ansLines[i]) {
                    line += chalk.bgGreen("  ");
                } else {
                    line += chalk.bgRed("  ");
                }

                console.log(line);
            }
            console.log();
            return Veredict.WA;
        }
    }

    static getInputPath(filePath: string, testId: number) {
        let filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
        return `${filePathNoExtension}.in${testId}`;
    }

    static getOutputPath(filePath: string, testId: number) {
        let filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
        return `${filePathNoExtension}.out${testId}`;
    }

    static getAnswerPath(filePath: string, testId: number) {
        let filePathNoExtension = filePath.substring(0, filePath.lastIndexOf("."));
        return `${filePathNoExtension}.ans${testId}`;
    }

    static getExecutionArgsForDebug(inputPath: string) {
        return ["<", `"${inputPath}"`];
    }

    static getTestCasesIdsForFile(filePath: string) {
        let parsedPath = Path.parse(filePath);
        let directoryPath = parsedPath.dir;
        if (directoryPath == "") directoryPath = ".";
        let fileNameNoExtension = parsedPath.name;
        var testcasesFiles = fs
            .readdirSync(directoryPath)
            .filter((fileName) => fileName.startsWith(`${fileNameNoExtension}.in`));
        if (testcasesFiles.length === 0) {
            console.log("No testcases available for this file:", filePath);
            exit(0);
        }
        let testcasesIds: number[] = [];
        testcasesFiles.forEach((filename) => {
            let num = parseInt(filename.replace(`${fileNameNoExtension}.in`, ""));
            testcasesIds.push(num);
        });
        return testcasesIds;
    }

    static runTest(execCommand: string, args: string[], filePath: string, testId: number): Veredict {
        console.log("\nEvaluating...\n");
        let execution = spawnSync(execCommand, args, {
            input: fs.readFileSync(Util.getInputPath(filePath, testId)),
            timeout: Util.extractTimeLimit(filePath)
        });

        if (execution.error?.message.includes("ETIMEDOUT")) {
            console.log(
                `Test Case ${testId}:`,
                chalk.bgHex("#8d42f5")(chalk.whiteBright(" T L E ")),
                "\n"
            );
            return Veredict.TLE;
        }

        if (execution.status !== 0) {
            console.log(`Test Case ${testId}:`, chalk.bgBlue(chalk.whiteBright(" R T E ")), "\n");
            if (execution.stdout.toString()) console.log(execution.stdout.toString());
            if (execution.stderr.toString()) console.log(execution.stderr.toString());
            return Veredict.RTE;
        }

        let outputPath = Util.getOutputPath(filePath, testId);
        if (execution.stdout) {
            fs.writeFileSync(outputPath, execution.stdout.toString());
        }
        return Util.printTestResults(outputPath, Util.getAnswerPath(filePath, testId), testId);
    }

    static runDebugWithUserInput(command: string, args: string[] = []) {
        console.log("Running with debugging flags\n\nEnter your input manually\n");
        spawnSync(command, args, { stdio: "inherit" });
    }

    static runDebug(execCommand: string, args: string[], filePath: string, testId: number) {
        console.log("Running Test Case", testId, "with debugging flags\n");
        let execution = spawnSync(
            execCommand,
            [...args, "<", `"${Util.getInputPath(filePath, testId)}"`],
            { shell: true }
        );

        if (execution.stdout.toString()) {
            console.log(execution.stdout.toString());
        }

        if (execution.stderr.toString()) {
            console.log(
                Util.replaceAll(
                    execution.stderr.toString(),
                    "runtime error",
                    chalk.red("runtime error")
                )
            );
        }
    }

    static normalizeName(name: string) {
        name = Util.replaceAll(name, "'", "");
        name = Util.replaceAll(name, "(", "");
        name = Util.replaceAll(name, ")", "");
        name = Util.replaceAll(name, ",", "");
        name = Util.replaceAll(name, "*", "");
        name = Util.replaceAll(name, "/", "");
        name = Util.replaceAll(name, '"', "");
        name = Util.replaceAll(name, " ", "");
        name = Util.replaceAll(name, "#", "");
        name = Util.replaceAll(name, "[", "");
        name = Util.replaceAll(name, "]", "");
        return name;
    }

    static getCommentString(extension: string) {
        extension = Util.replaceAll(extension, ".", "");
        let slashes = ["java", "cpp", "c"];
        if (slashes.includes(extension)) {
            return "//";
        } else if (extension == "py") {
            return "#";
        } else {
            return undefined;
        }
    }

    static async readToEOF(): Promise<string> {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let lines = "";
        rl.on("line", (line) => {
            lines += line + "\n";
        });
        await once(rl, "close");
        return lines;
    }

    static extractTimeLimit(filePath: string): number {
        let text = fs.readFileSync(filePath).toString();
        let match = /time-limit\s*:\s*[0-9]+/g.exec(text);
        let time = 3000; // Default time
        if (match) {
            let i = match.index;
            let mil = "";
            while (!(text[i] >= '0' && text[i] <= '9') && i < text.length) i++;
            while (text[i] >= '0' && text[i] <= '9' && i < text.length) mil += text[i++];
            time = parseInt(mil);
        }
        return time;
    }

    static repeat(s: string, times: number) {
        let ans = "";
        for (let i = 0; i < times; i++) {
            ans += s;
        }
        return ans;
    }

    static printScore(ac: number, total: number): void {
        let plainmsg = `| ${ac.toString()} / ${total} AC |`;
        let msg = `| ${ac.toString()} / ${total} ${chalk.greenBright("AC")} |`;
        let summary = "Summary: ";
        console.log();
        console.log(Util.repeat(" ", summary.length) + Util.repeat("+", plainmsg.length));
        console.log(summary + msg);
        console.log(Util.repeat(" ", summary.length) + Util.repeat("+", plainmsg.length));
        console.log();
    }
}
