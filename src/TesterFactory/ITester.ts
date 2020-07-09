import Config from "../Config";

export default interface ITester {
    config: Config;
    filePath: string;
    testOne(id: number): void;
    testAll(): void;
    debugOne(id: number): void;
    debugAll(): void;
}