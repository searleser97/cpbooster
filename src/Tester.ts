import Config from "./Config";

export default class Tester {
    config: Config;
    filePath: string;
    fileExtension: string | undefined;
    filePathNoExtension: string;
    testId?: number;

    constructor(config: Config, filePath: string, testId?: number) {
        this.config = config;
        this.filePath = filePath;
        this.testId = testId;
        let segmentedPath = filePath.split('.');
        this.filePathNoExtension = segmentedPath[0];
        this.fileExtension = segmentedPath.pop(); 
    }

    run() {
        // compilation
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