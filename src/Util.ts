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
import { createInterface } from "readline";
import { once } from "events";

export default class Util {
  static replaceAll(text: string, oldString: string, newString: string): string {
    return text.split(oldString).join(newString);
  }

  static normalizeName(name: string) {
    name = Util.replaceAll(name, "'", "");
    name = Util.replaceAll(name, "(", "");
    name = Util.replaceAll(name, ")", "");
    name = Util.replaceAll(name, ",", "");
    name = Util.replaceAll(name, "*", "");
    name = Util.replaceAll(name, "/", "");
    name = Util.replaceAll(name, '"', "");
    name = Util.replaceAll(name, " ", "");
    name = Util.replaceAll(name, "#", "");
    name = Util.replaceAll(name, "[", "");
    name = Util.replaceAll(name, "]", "");
    return name;
  }

  static getCommentString(extension: string) {
    extension = Util.replaceAll(extension, ".", "");
    let slashes = ["java", "cpp", "c"];
    if (slashes.includes(extension)) {
      return "//";
    } else if (extension == "py") {
      return "#";
    } else {
      return undefined;
    }
  }

  static async readToEOF(): Promise<string> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let lines = "";
    rl.on("line", (line) => {
      lines += line + "\n";
    });
    await once(rl, "close");
    return lines;
  }

  static repeat(s: string, times: number) {
    let ans = "";
    for (let i = 0; i < times; i++) {
      ans += s;
    }
    return ans;
  }
}
