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
  static allowedSpecialChars = new Set(["-", "_", "+", "."]);

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

  static normalizeName(name: string): string {
    let normalName = "";
    for (const c of name) {
      if (this.isAlphaNum(c) || this.allowedSpecialChars.has(c)) {
        normalName += c;
      }
    }
    return normalName;
  }

  static getCommentString(extension: string): "//" | "#" | undefined {
    extension = Util.replaceAll(extension, ".", "").toLowerCase();
    const slashes = ["java", "cpp", "c"];
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
}
