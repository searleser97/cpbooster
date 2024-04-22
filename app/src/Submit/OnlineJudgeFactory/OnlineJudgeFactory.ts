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
import AtCoder from "./AtCoder";
import Codeforces from "./Codeforces";
import UniversalOJ from "./UniversalOJ";
import QOJ from "./QOJ";
import Ucup from "./Ucup";
import TLX from "./TLX";
import OmegaUp from "./OmegaUp";
import Szkopul from "./Szkopul";
import Yandex from "./Yandex";
import OnlineJudge from "./OnlineJudge";

export default class OnlineJudgeFactory {
  static getOnlineJudge(url: string): OnlineJudge {
    url = url.toLowerCase();
    if (url.includes("codeforces")) {
      return new Codeforces();
    } else if (url.includes("atcoder")) {
      return new AtCoder();
    } else if (url.includes("uoj.ac")) {
      return new UniversalOJ();
    } else if (url.includes("qoj.ac")) {
      return new QOJ();
    } else if (url.includes("contest.ucup.ac")) {
      return new Ucup();
    } else if (url.includes("tlx.toki.id")) {
      return new TLX();
    } else if (url.includes("omegaup")) {
      return new OmegaUp();
    } else if (url.includes("szkopul.edu.pl")) {
      return new Szkopul();
    } else if (url.includes("official.contest.yandex")) {
      return new Yandex();
    } else {
      console.log("Online Judge not supported");
      exit(0);
    }
  }
}
