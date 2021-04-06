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
import { Languages } from "./Types/Languages";

export default class Config {
  static readonly defaultConfigFilePath = Path.join(os.homedir(), "cpbooster-config.json");
  static readonly alternativeConfigFilePath = Path.join(
    os.homedir(),
    ".cpbooster",
    "cpbooster-config.json"
  );

  contestsDirectory: string;
  port: number;
  terminal: string;
  closeAfterClone: boolean;
  showStatusPageOnSubmit: boolean;
  preferredLang: string;

  languages: Languages;

  constructor() {
    this.contestsDirectory = Path.join(os.homedir(), "Contests");
    this.port = 1327;
    this.terminal = "konsole";
    this.closeAfterClone = false;
    this.showStatusPageOnSubmit = false;
    this.preferredLang = "cpp";
    this.languages = {
      cpp: {
        template: "template.cpp",
        command: "g++ -std=gnu++17 -O2",
        debugCommand: "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall",
        aliases: {
          codeforces: "54",
          atcoder: "4003"
        }
      },
      py: {
        template: "template.py",
        command: "python3",
        debugCommand: "python3 -O",
        aliases: {
          codeforces: "31",
          atcoder: "4006"
        }
      }
    };
  }

  private static printAlreadyExistsMsg(configFilePath: string) {
    console.log(`"${configFilePath}" already exists`);
  }

  private static printConfigWrittenMsg(configFilePath: string) {
    console.log(`Your configuration file has been written in: "${configFilePath}"`);
  }

  static write(configFilePath: string | undefined | null): void {
    if (configFilePath) {
      if (fs.existsSync(configFilePath)) {
        this.printAlreadyExistsMsg(configFilePath);
      } else {
        fs.writeFileSync(configFilePath, JSON.stringify(new Config(), null, 2));
        this.printConfigWrittenMsg(configFilePath);
      }
    } else {
      if (fs.existsSync(Config.defaultConfigFilePath)) {
        this.printAlreadyExistsMsg(Config.defaultConfigFilePath);
      } else if (fs.existsSync(Config.alternativeConfigFilePath)) {
        this.printAlreadyExistsMsg(Config.alternativeConfigFilePath);
      } else {
        fs.writeFileSync(Config.defaultConfigFilePath, JSON.stringify(new Config(), null, 2));
        this.printConfigWrittenMsg(Config.defaultConfigFilePath);
      }
    }
  }

  static read(configFilePath: string | undefined | null): Config {
    if (configFilePath && fs.existsSync(configFilePath)) {
      // for now we are assuming that all the properties are defined in the config file
      return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
    } else if (fs.existsSync(Config.defaultConfigFilePath)) {
      return JSON.parse(fs.readFileSync(Config.defaultConfigFilePath, "utf8"));
    } else if (fs.existsSync(Config.alternativeConfigFilePath)) {
      return JSON.parse(fs.readFileSync(Config.alternativeConfigFilePath, "utf8"));
    } else {
      console.log("\nconfiguration file not found in any of the following locations:\n");
      if (configFilePath) {
        console.log("->", configFilePath);
      }
      console.log("->", Config.defaultConfigFilePath);
      console.log("->", Config.alternativeConfigFilePath, "\n");
      console.log("You can create one in your $HOME directory by running 'cpbooster init'\n");
      exit(0);
    }
  }
}
