import Config from "../Config";
import CppTester from "./CppTester";
import * as Path from "path";
import { exit } from "process";
import ITester from "./ITester";

export default class TesterFactory {

    static normalizeExtension(extension: string): string {
        return extension.toLowerCase();
    }

    static getTester(config: Config, filePath: string) : ITester {
        let extension = TesterFactory.normalizeExtension(Path.extname(filePath));
        if (extension == ".cpp")
            return new CppTester(config, filePath);
        else {
            console.log("Language not supported");
            exit(0);
        }
    }
}