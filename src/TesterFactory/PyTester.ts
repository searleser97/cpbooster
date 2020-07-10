import ITester from "./ITester";
import Config from "../Config";
import Util from "../Util";

export default class PyTester implements ITester {
    config: Config;
    filePath: string;
    constructor(config: Config, filePath: string) {
        this.config = config;
        this.filePath = filePath;
    }

    testOne(testId: number, compile: boolean): void {
        let outputPath = Util.getOutputPath(this.filePath, testId);
        let executionArgs = Util.getExecutionArgsForTest(
            Util.getInputPath(this.filePath, testId),
            outputPath
        );
        executionArgs.unshift(this.filePath);
        Util.runTest(this.config.pyRunCommand, this.filePath, testId, executionArgs);
    }

    testAll(compile: boolean): void {
        let testcasesIds = Util.getTestCasesIdsForFile(this.filePath);
        for (let i = 0; i < testcasesIds.length; i++) {
            this.testOne(testcasesIds[i], false);
        }
    }

    debugOne(testId: number, compile: boolean): void {
        let executionArgs = Util.getExecutionArgsForDebug(Util.getInputPath(this.filePath, testId));
        executionArgs.unshift(this.filePath);
        Util.runDebug(this.config.pyRunCommand, this.filePath, testId, executionArgs);
    }

    debugWithUserInput(compile: boolean): void {
        Util.runDebugWithUserInput(this.config.pyRunCommand, [this.filePath]);
    }
}
