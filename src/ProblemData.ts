import TestData from './TestData';

export default interface ProblemData {
    name: string;
    group: string;
    url: string;
    interactive: boolean;
    memoryLimit: number;
    timeLimit: number;
    tests: TestData[];
    testType: string;
    input: object;
    output: object;
    languages: object;
}
