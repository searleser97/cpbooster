import Config from "../Config";

export default interface ITester {
    config: Config;
    filePath: string;
    testOne(testId: number, compile: boolean): void;
    testAll(compile: boolean): void;
    debugOne(testId: number, compile: boolean): void;
    debugWithUserInput(compile: boolean): void;
}