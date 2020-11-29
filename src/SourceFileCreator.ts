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
import Config from "./Config";
import * as Path from "path";
import Util from "./Util";

export default class SourceFileCreator {
  static create(filePath: string, config: Config, timeLimitInMS: number) {
    let extension = Path.extname(filePath);
    let template = `${Util.getCommentString(extension)} time-limit: ${timeLimitInMS}\n`;
    if (extension == ".cpp" && config.cppTemplatePath) {
      template += fs.readFileSync(config.cppTemplatePath).toString();
    } else if (extension == ".py" && config.pyTemplatePath) {
      template += fs.readFileSync(config.pyTemplatePath).toString();
    }
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, template);
  }
}
