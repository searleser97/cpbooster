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
import Config from "../Config/Config";
import * as Path from "path";
import Util from "../Util";

export default class SourceFileCreator {
  static create(filePath: string, config: Config, timeLimitInMS: number = 3000) {
    let filename = Path.basename(filePath);
    let match = /\{[a-zA-Z](\.{2,}|-)[a-zA-Z]\}\.[a-zA-Z0-9]+/g.exec(filename);
    if (match) {
      let idx = match[0].indexOf("}");
      this.createMultiple(filePath, config, timeLimitInMS, match[0][1], match[0][idx - 1]);
    } else {
      this.createSingle(filePath, config, timeLimitInMS);
    }
  }

  static createSingle(filePath: string, config: Config, timeLimitInMS: number = 3000) {
    let extension = Path.extname(filePath);
    let filename = Util.normalizeName(Path.basename(filePath));
    filePath = Path.join(Path.dirname(filePath), filename);
    let template = "";
    let commentString = Util.getCommentString(extension);
    if (commentString) {
      template += `${commentString} time-limit: ${timeLimitInMS}\n`;
    }
    if (extension == ".cpp" && config.cpp.template) {
      template += fs.readFileSync(config.cpp.template).toString();
    } else if (extension == ".py" && config.py.template) {
      template += fs.readFileSync(config.py.template).toString();
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, template);
      console.info("Source file", filename, "created.");
    } else {
      console.info("Source file", filename, "already existed.");
    }
  }

  static createMultiple(
    filePath: string,
    config: Config,
    timeLimitInMS: number,
    start: string,
    end: string
  ) {
    if (start.length != 1 || end.length != 1) {
      throw new Error("incorrect format of start or end, it should be a single character");
    }
    let dirname = Path.dirname(filePath);
    let extension = Path.extname(filePath);
    let filePaths: any[] = [];
    let startCode = start.toLowerCase().charCodeAt(0);
    let endCode = end.toLowerCase().charCodeAt(0);
    if (endCode < startCode) {
      [startCode, endCode] = [endCode, startCode];
    }
    for (let i = startCode; i <= endCode; i++) {
      filePaths.push(Path.join(dirname, String.fromCharCode(i) + extension));
    }
    for (filePath of filePaths) {
      SourceFileCreator.createSingle(filePath, config, timeLimitInMS);
    }
  }
}
