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

import Config from "../Config/Config";
import ICommandGlobalArgs from "../Types/ICommandGlobalArgs";
import OnlineJudgeFactory from "./OnlineJudgeFactory/OnlineJudgeFactory";
import * as Path from "path";

export interface ICommandSubmitArgs extends ICommandGlobalArgs {
  filePath: string;
  url?: string;
  lang?: string;
}

function extractUrlFromFile(filePath: string): string {
  // send error message if url not found in file
  // return "https://codeforces.com/contest/1486/problem/D";
  return "https://atcoder.jp/contests/abc194/tasks/abc194_a";
}

export function submit(args: ICommandSubmitArgs) {
  const config = Config.read(args.config);
  const url = args.url ?? extractUrlFromFile(args.filePath);
  const oj = OnlineJudgeFactory.getOnlineJudge(url);
  oj.submit(
    args.filePath,
    url,
    // args.lang ?? getPreferredLang(Path.extname(args.filePath), url, config)
    args.lang ?? "cpp"
  );
}
