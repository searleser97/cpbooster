/*
    cpbooster "Competitive Programming Booster"
    Copyright (C) 2020  Sergio G. Sanchez V.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as fs from "fs";
import * as Path from "path";
import * as os from "os";
import { exit } from "process";
import { LangConfig } from "./Types/LangConfig";
import Util from "../Utils/Util";

export default class Config {
  static readonly defaultConfigFilePaths = [
    Path.join(os.homedir(), "cpbooster-config.json"),
    Path.join(os.homedir(), ".cpbooster", "cpbooster-config.json"),
    Path.join(os.homedir(), ".config", "cpbooster", "cpbooster-config.json")
  ];

  contestsDirectory: string;
  port: number;
  terminal: string | undefined | null;
  editor: string;
  closeAfterClone: boolean;
  showStatusPageOnSubmit: boolean;
  useUserDefaultBrowser: boolean;
  createContestPlatformDirectory: boolean;
  // preferred language extension
  preferredLang: string;
  hideTestCaseInput: boolean;
  maxLinesToShowFromInput: number;
  cloneInCurrentDir: boolean;
  executableFileExtension: string;
  // config for language extension
  languages: Record<string, LangConfig | undefined>;

  constructor() {
    this.contestsDirectory = Path.join(os.homedir(), "Contests");
    this.port = 1327;
    this.editor = "konsole";
    this.closeAfterClone = false;
    this.showStatusPageOnSubmit = true;
    this.useUserDefaultBrowser = true;
    this.createContestPlatformDirectory = true;
    this.preferredLang = "cpp";
    this.hideTestCaseInput = false;
    this.maxLinesToShowFromInput = 50;
    this.cloneInCurrentDir = false;
    this.executableFileExtension = "exe";
    this.languages = {
      cpp: {
        template: "",
        command: "g++ -std=gnu++17 -O2",
        debugCommand: "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall",
        aliases: {
          codeforces: "54",
          atcoder: "5001",
          omegaup: "cpp17-gcc",
          szkopul: "C++",
          yandex: "gcc7_3"
        },
        type: "compiled",
        commentString: "//"
      },
      py: {
        template: "",
        command: "python3",
        debugCommand: "python3 -O",
        aliases: {
          codeforces: "31",
          atcoder: "4006",
          omegaup: "py3",
          szkopul: "Python"
        },
        type: "interpreted",
        commentString: "#"
      },
      java: {
        template: "",
        command: "javac",
        debugCommand: "javac",
        runCommand: "java",
        aliases: {
          codeforces: "36",
          atcoder: "4005"
        },
        type: "mixed",
        commentString: "//"
      },
      js: {
        template: "",
        command: "node",
        debugCommand: "node",
        aliases: {
          codeforces: "55",
          atcoder: "4030"
        },
        type: "interpreted",
        commentString: "//"
      },
      rb: {
        template: "",
        command: "ruby",
        debugCommand: "ruby",
        aliases: {
          codeforces: "67",
          atcoder: "4049"
        },
        type: "interpreted",
        commentString: "#"
      },
      cs: {
        template: "",
        command: "msc",
        debugCommand: "msc",
        aliases: {
          codeforces: "55",
          atcoder: "4030",
          omegaup: "cs"
        },
        type: "compiled",
        commentString: "//"
      },
      rs: {
        template: "",
        command: "rustc",
        debugCommand: "rustc",
        aliases: {
          codeforces: "49",
          atcoder: "4050"
        },
        type: "compiled",
        commentString: "//"
      },
      go: {
        template: "",
        command: "go build",
        debugCommand: "go build",
        aliases: {
          codeforces: "32",
          atcoder: "4026"
        },
        type: "compiled",
        commentString: "//"
      },
      kt: {
        template: "",
        command: "kotlinc",
        debugCommand: "kotlinc",
        runCommand: "kotlin",
        aliases: {
          codeforces: "48",
          atcoder: "4032"
        },
        type: "mixed"
      },
      scala: {
        template: "",
        command: "scalac",
        debugCommand: "scalac",
        runCommand: "scala",
        aliases: {
          codeforces: "20",
          atcoder: "4051"
        },
        type: "mixed"
      }
    };
  }

  private static printAlreadyExistsMsg(configFilePath: string) {
    console.log(`"${configFilePath}" already exists`);
  }

  private static printConfigWrittenMsg(configFilePath: string) {
    console.log(`Your configuration file has been written in: "${configFilePath}"`);
  }

  static write(configFilePath: string = this.defaultConfigFilePaths[0]): void {
    if (fs.existsSync(configFilePath)) {
      this.printAlreadyExistsMsg(configFilePath);
    } else {
      fs.writeFileSync(configFilePath, JSON.stringify(new Config(), null, 2));
      this.printConfigWrittenMsg(configFilePath);
    }
  }

  static read(configFilePath: string | undefined | null): Config {
    const configFilePaths = configFilePath ? [configFilePath] : [];
    configFilePaths.push(...this.defaultConfigFilePaths);

    for (const configPath of configFilePaths) {
      if (fs.existsSync(configPath)) {
        // for now we are assuming that all the properties are defined in the config file
        const config: Config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        if (config.terminal && !config.editor) {
          config.editor = config.terminal;
        }
        config.contestsDirectory = Util.replaceTildeWithAbsoluteHomePath(config.contestsDirectory);
        for (const langConfig of Object.values(config.languages)) {
          if (langConfig) {
            langConfig.template = Util.replaceTildeWithAbsoluteHomePath(langConfig.template);
          }
        }
        return config;
      }
    }

    console.log("\nconfiguration file not found in any of the following locations:\n");
    for (const configPath of configFilePaths) {
      console.log("->", configPath);
    }
    console.log("\nYou can create one in your $HOME directory by running 'cpbooster init'\n");
    exit(0);
  }
}
