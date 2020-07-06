import * as fs from "fs";
import * as Path from "path";
import * as os from "os";

export default class Config {
    static readonly defaultConfigFilePath = Path.join(os.homedir(), "cpbooster-config.json");

    contestsDirectory: string;
    cppTemplatePath: string;
    cppCompileCommand: string;
    cppDebugCommand: string;
    pyTemplatePath: string;
    pyRunCommand: string;
    preferredLang: string;
    port: number;

    constructor() {
        this.contestsDirectory = Path.join(os.homedir(), "CompetitiveProgramming/Contests");
        this.cppTemplatePath = Path.join(os.homedir(), "template.cpp");
        this.cppCompileCommand = "g++ -std=gnu++17 -O2";
        this.cppDebugCommand = "g++ -std=gnu++17 -DDEBUG";
        this.pyTemplatePath = Path.join(os.homedir(), "template.py");
        this.pyRunCommand = "python3";
        this.preferredLang = "cpp";
        this.port = 1327;
    }

    write(configFilePath: string = Config.defaultConfigFilePath) {
        fs.writeFileSync(configFilePath, JSON.stringify(this, null, 4));
    }

    read(configFilePath: string = Config.defaultConfigFilePath) {
        Object.assign(this, JSON.parse(fs.readFileSync(configFilePath, "utf8")));
    }
}