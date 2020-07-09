import * as fs  from "fs";
import chalk from "chalk";

export default class Util {
    static replaceAll(text: string, oldString: string, newString: string): string {
        return text.split(oldString).join(newString);
    }

    static printTestResults(outputFilePath: string, answerFilePath: string, testId: number | string): void {
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
            console.log(chalk.bgGreen(chalk.whiteBright("Your Output:") + "\n" + output));
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
                    if (outputLines[i] === ansLines[i])
                        line += chalk.bgGreen("  ");
                    else
                        line += chalk.bgRed("  ");
                }
                console.log(line);
            }
            console.log();
        }
    }
};