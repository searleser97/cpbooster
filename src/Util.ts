import * as fs from "fs";
import chalk from "chalk";
import * as Path from "path";
import { exit } from "process";
import { spawnSync, spawn } from "child_process";

export default class Util {
    static replaceAll(text: string, oldString: string, newString: string): string {
        return text.split(oldString).join(newString);
    }

    static printTestResults(outputFilePath: string, answerFilePath: string, testId: number): void {
        if (!fs.existsSync(outputFilePath)) {
            console.log("output file not found in", outputFilePath);
            return;
        }
        if (!fs.existsSync(answerFilePath)) {
            console.log("answer file not found in", answerFilePath);
            return;
        }
        let ans = fs.readFileSync(answerFilePath).toString();
        let output = fs.readFileSync(outputFilePath).toString();

        if (ans.trim() === output.trim()) {
            console.log(`Test Case ${testId}:`, chalk.bgGreen(chalk.whiteBright(" A C ")), "\n");
            if (ans !== output)
                console.log(chalk.yellow("Check leading and trailing blank spaces") + "\n");
            console.log(chalk.bgGreen(chalk.whiteBright("Your Output:")) + "\n");
            console.log(output);
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

                if (i < outputLines.length && i < ansLines.length) {
                    if (outputLines[i] === ansLines[i]) line += chalk.bgGreen("  ");
                    else line += chalk.bgRed("  ");
                }
                console.log(line);
            }
            console.log();
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

    static getExecutionArgsForTest(inputPath: string, outputPath: string) {
        return ["<", `"${inputPath}"`, ">", `"${outputPath}"`];
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

    static runTest(command: string, filePath: string, testId: number, executionArgs: string[]) {
        let outputPath = Util.getOutputPath(filePath, testId);
        let execution = spawnSync(command, executionArgs, { shell: true });
        if (execution.stdout) {
            let executionStdout = Buffer.from(execution.stdout).toString("utf8");
            if (executionStdout !== "") console.log(executionStdout);
        }
        if (execution.stderr) {
            let executionStderr = Buffer.from(execution.stderr).toString("utf8");
            if (executionStderr !== "") {
                console.log(
                    `Test Case ${testId}:`,
                    chalk.bgBlue(chalk.whiteBright(" R T E ")),
                    "\n"
                );
                console.log(executionStderr);
                return;
            }
        }
        let ansPath = Util.getAnswerPath(filePath, testId);
        Util.printTestResults(outputPath, ansPath, testId);
    }

    static runDebugWithUserInput(command: string, args: string[] = []) {
        console.log("Running with debugging flags\n\nEnter your input manually");

        let execution = spawn(command, args, { stdio: "inherit" });
        console.log();
        execution.stdout?.on("data", (data) => {
            console.log(data);
        });
    }

    static runDebug(command: string, filePath: string, testId: number, executionArgs: string[]) {
        console.log("Running Test Case", testId, "with debugging flags\n");

        let execution = spawnSync(command, executionArgs, { shell: true });
        if (execution.stdout) {
            let executionStdout = Buffer.from(execution.stdout).toString("utf8");
            if (executionStdout !== "") console.log(executionStdout);
        }

        if (execution.stderr) {
            let executionStderr = Buffer.from(execution.stderr).toString("utf8");
            if (executionStderr !== "") {
                executionStderr = Util.replaceAll(
                    executionStderr,
                    "runtime error",
                    chalk.blueBright("runtime error")
                );
                console.log(executionStderr);
                return;
            }
        }
    }
}
