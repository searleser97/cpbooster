import Config from "./Config";

export default class Tester {
    config: Config;
    filePath: string;
    testId?: number;
    constructor(config: Config, filePath: string, testId?: number) {
        this.config = config;
        this.filePath = filePath;
        this.testId = testId;
    }

    run() {
        if (this.testId) {
        } else {
        }
    }

    debug() {
        if (this.testId) {
        } else {
        }
    }
}