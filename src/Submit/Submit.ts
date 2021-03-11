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

import { exit } from "process";
import Config from "../Config/Config";
import ICommandGlobalArgs from "../Types/ICommandGlobalArgs";
import OnlineJudgeFactory from "./OnlineJudgeFactory/OnlineJudgeFactory";
import * as fs from "fs";
import * as Path from "path";
import Util from "../Util";

export interface ICommandSubmitArgs extends ICommandGlobalArgs {
  filePath: string;
  url?: string;
  langAlias?: string;
}

function extractUrlFromFile(filePath: string): string | undefined {
  const text = fs.readFileSync(filePath).toString();
  const match = /problem-url\s*:\s*.+/g.exec(text);
  if (match) {
    const patternFound = match[0];
    let url = patternFound.substr(patternFound.indexOf(":") + 1).trim();
    return url;
  } else {
    return undefined;
  }
}

export function submit(args: ICommandSubmitArgs) {
  const url = args.url ?? extractUrlFromFile(args.filePath);
  if (!url) {
    const commentString = Util.getCommentString(Path.extname(args.filePath));
    console.log(
      "Problem URL couldn't be found in file, please provide it as argument or" +
        " add it as a comment in your file in the following format:\n\n" +
        `${commentString} problem-url: <url>`
    );
    exit(0);
  }
  console.log("submitting...");
  const oj = OnlineJudgeFactory.getOnlineJudge(url);
  const config = Config.read(args.config);
  oj.submit(args.filePath, url, config, args.langAlias);
}
