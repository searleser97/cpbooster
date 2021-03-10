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

export default class Config {
  static readonly defaultConfigFilePath = Path.join(os.homedir(), "cpbooster-config.json");

  contestsDirectory: string;
  port: number;
  terminal: string;
  closeAfterClone: boolean;
  showStatusPageOnSubmit: boolean;
  preferredLang: string;

  cpp: LangConfig;
  py: LangConfig;

  /*
  java: LangConfig;
  kt: LangConfig;
  rs: LangConfig;
  */

  constructor() {
    this.contestsDirectory = Path.join(os.homedir(), "Contests");
    this.port = 1327;
    this.terminal = "konsole";
    this.closeAfterClone = false;
    this.showStatusPageOnSubmit = false;
    this.preferredLang = "cpp";
    this.cpp = {
      template: "template.cpp",
      command: "g++ -std=gnu++17 -O2",
      debugCommand: "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall",
      aliases: {
        codeforces: "54",
        atcoder: "4003"
      }
    };
    this.py = {
      template: "template.py",
      command: "python3",
      debugCommand: "python3 -O",
      aliases: {
        codeforces: "31",
        atcoder: "4006"
      }
    };
  }

  static write(configFilePath: string = Config.defaultConfigFilePath): void {
    if (!fs.existsSync(configFilePath)) {
      fs.writeFileSync(configFilePath, JSON.stringify(new Config(), null, 2));
      console.log(`Your configuration file has been written in: "${configFilePath}"`);
    } else {
      console.log(`"${configFilePath}" already exists`);
    }
  }

  static read(configFilePath: string = Config.defaultConfigFilePath): Config {
    if (!fs.existsSync(configFilePath)) {
      console.log("configuration file not found in:", configFilePath);
      console.log("You can create one in your $HOME directory by running 'cpbooster init'");
      exit(0);
    }
    // for now we are assuming that all the properties are defined in the config file
    return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
  }
}
