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
  terminal: string;
  closeAfterClone: boolean;

  constructor() {
    this.contestsDirectory = Path.join(os.homedir(), "Contests");
    this.cppTemplatePath = "";
    this.cppCompileCommand = "g++ -std=gnu++17 -O2";
    this.cppDebugCommand = "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall";
    this.pyTemplatePath = "";
    this.pyRunCommand = "python3";
    this.preferredLang = "cpp";
    this.port = 1327;
    this.terminal = "konsole";
    this.closeAfterClone = false;
  }

  write(configFilePath: string = Config.defaultConfigFilePath) {
    if (!fs.existsSync(configFilePath)) {
      fs.writeFileSync(configFilePath, JSON.stringify(this, null, 4));
      console.log(`Your configuration file has been written in: ${configFilePath}`);
    }
  }

  read(configFilePath: string = Config.defaultConfigFilePath) {
    if (!fs.existsSync(configFilePath)) {
      console.log("configuration file not found in:", configFilePath);
      console.log("You can create one in your $HOME directory by running 'cpbooster new'");
      exit(0);
    }
    Object.assign(this, JSON.parse(fs.readFileSync(configFilePath, "utf8")));
  }
}
