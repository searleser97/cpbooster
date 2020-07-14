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
        Util.runTest(
            this.config.pyRunCommand.split(" ")[0],
            [this.filePath],
            this.filePath,
            testId
        );
    }

    testAll(compile: boolean): void {
        let testcasesIds = Util.getTestCasesIdsForFile(this.filePath);
        for (let i = 0; i < testcasesIds.length; i++) {
            this.testOne(testcasesIds[i], false);
        }
    }

    debugOne(testId: number, compile: boolean): void {
        Util.runDebug(
            this.config.pyRunCommand.split(" ")[0],
            [this.filePath],
            this.filePath,
            testId
        );
    }

    debugWithUserInput(compile: boolean): void {
        Util.runDebugWithUserInput(this.config.pyRunCommand.split(" ")[0], [this.filePath]);
    }
}
