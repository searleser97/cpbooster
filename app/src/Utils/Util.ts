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
import * as os from "os";
import * as Path from "path";
import { LangExtensions } from "./LangExtensions";
import Config from "Config/Config";

export default class Util {
  static allowedSpecialChars = new Set(["_", "."]);

  static isAlpha(char: string): boolean {
    if (char.length != 1) {
      return false;
    } else {
      const thisCharCode = char.charCodeAt(0);
      if (
        ("a".charCodeAt(0) <= thisCharCode && thisCharCode <= "z".charCodeAt(0)) ||
        ("A".charCodeAt(0) <= thisCharCode && thisCharCode <= "Z".charCodeAt(0))
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  static isNum(char: string): boolean {
    if (char.length != 1) {
      return false;
    } else {
      const thisCharCode = char.charCodeAt(0);
      if ("0".charCodeAt(0) <= thisCharCode && thisCharCode <= "9".charCodeAt(0)) {
        return true;
      } else {
        return false;
      }
    }
  }

  static isAlphaNum(char: string): boolean {
    if (char.length != 1) {
      return false;
    } else {
      if (this.isAlpha(char) || this.isNum(char)) {
        return true;
      } else {
        return false;
      }
    }
  }

  static replaceAll(text: string, oldString: string, newString: string): string {
    return text.split(oldString).join(newString);
  }

  static replaceExtraDotsWithUnderscore(fileName: string): string {
    const fileNameNoDots = Array.from(fileName);
    let extensionDotFound = false;
    for (let i = fileName.length - 1; i >= 0; i--) {
      if (!extensionDotFound && fileName[i] === ".") {
        extensionDotFound = true;
        continue;
      }

      if (fileName[i] === ".") {
        fileNameNoDots[i] = "_";
      }
    }
    return fileNameNoDots.join("");
  }

  static normalizeFileName(fileName: string): string {
    fileName = this.replaceExtraDotsWithUnderscore(fileName);
    let normalName = "";
    for (const c of fileName) {
      if (this.isAlphaNum(c) || this.allowedSpecialChars.has(c)) {
        normalName += c;
      }
    }
    return normalName;
  }

  static normalizeFilePath(filePath: string): string {
    const dirPath = Path.dirname(filePath);
    return Path.join(dirPath, Util.normalizeFileName(Path.basename(filePath)));
  }

  static getCommentString(langExtension: string, config: Config): string {
    const langConfig = config.languages[langExtension];
    if (langConfig?.commentString) {
      return langConfig.commentString;
    }
    langExtension = Util.replaceAll(langExtension, ".", "").toLowerCase();
    const hashes = [LangExtensions.python.toString(), LangExtensions.ruby.toString()];
    if (hashes.includes(langExtension)) {
      return "#";
    } else {
      return "//";
    }
  }

  static async readToEOF(): Promise<string> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    let lines = "";
    rl.on("line", (line: string) => {
      lines += line + "\n";
    });
    await once(rl, "close");
    return lines;
  }

  static repeat(str: string, times: number): string {
    let ans = "";
    for (let i = 0; i < times; i++) {
      ans += str;
    }
    return ans;
  }

  static padCenter(str: string, width: number): string {
    if (str.length >= width) {
      return str;
    } else {
      const remaningSpace = width - str.length;
      const spaceOnLeftSide = Math.floor(remaningSpace / 2);
      const spaceOnRightSide = remaningSpace - spaceOnLeftSide;
      const answer = this.repeat(" ", spaceOnLeftSide) + str + this.repeat(" ", spaceOnRightSide);
      return answer;
    }
  }

  /**
   * Creates a sequence of numbers from `start` to `end`
   *
   * @param {number} start The start of the sequence inclusively
   * @param {number} end The end of the sequence exclusively
   * @returns an array of size `end - start` containing the sequence of numbers in the range [start, end)
   */
  static sequence(start: number, end: number): number[] {
    const n = Math.abs(end - start);
    const seq = new Array(n);
    const isDecreasing = start > end;
    for (let i = 0; i < n; i++, start += isDecreasing ? -1 : 1) {
      seq[i] = start;
    }
    return seq;
  }

  static getExtensionName(filePath: string): string {
    return Path.extname(filePath).substr(1).toLowerCase();
  }

  static replaceTildeWithAbsoluteHomePath(contestsDirectory: string): string {
    return contestsDirectory.replace("~", os.homedir());
  }

  static isWindows(): boolean {
    return os.type() === "Windows_NT" || os.release().includes("Microsoft");
  }

  static getCodeforcesFormatedContestName(contestName: string): string {
    let formatedContestName = contestName;
    const prefix = "Codeforces";
    while(formatedContestName.startsWith(prefix)) {
      formatedContestName = formatedContestName.substring(prefix.length);
    }
    let match = formatedContestName.match(/(EducationalCodeforcesRound)(\d+)(Ratedfor)(Div\.\d)/);
    if(match){
      formatedContestName = `EducationalRound_${match[2]}_${match[4]}`
    }
    else{
      let match = formatedContestName.match(/(\w*Round)(\d+)(Div\.\d)?/);
      if(match){
        formatedContestName = `${match[1]}_${match[2]}${match[3]?'_'+match[3]:''}`
      }
    }
    return formatedContestName;
  }

  static splitOnlineJudgeName(contestName: string): Array<string> {
    const onlineJudgeNames = [
      "Codeforces",
      "CodeChef",
      "AtCoder",
      "HackerRank",
      "ProjectEuler",
      "TopCoder",
      "CSAcademy",
      "HackerEarth",
      "Kattis",
      "LeetCode",
      "SPOJ"
    ];
    for (const onlineJudgeName of onlineJudgeNames) {
      if (contestName.startsWith(onlineJudgeName)) {
        if(onlineJudgeName === "Codeforces") {
          return [onlineJudgeName, this.getCodeforcesFormatedContestName(contestName)];
        }
        return [onlineJudgeName, contestName.substring(onlineJudgeName.length)];
      }
    }
    console.log("Online Judge not identified, saving in root directory");
    return ["", contestName];
  }

  static getContestPath(contestName: string, config: Config): string {
    if (config.groupContestsByJudge) {
      const [onlineJudgeName, splitContestName] = this.splitOnlineJudgeName(contestName);
      if (config.cloneInCurrentDir) {
        return Path.join(onlineJudgeName, splitContestName);
      } else {
        return Path.join(config.contestsDirectory, onlineJudgeName, splitContestName);
      }
    } else {
      if (config.cloneInCurrentDir) {
        return contestName;
      }
      return Path.join(config.contestsDirectory, contestName);
    }
  }
}
