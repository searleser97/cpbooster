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

import ICommandGlobalArgs from "../Types/ICommandGlobalArgs";

export interface ICommandSubmitArgs extends ICommandGlobalArgs {
  filePath: string;
  url?: string;
}

export function submit(args: ICommandSubmitArgs) {
  // 2 methods to extract url:
  // If args contains url then use that one
  // otherwise extract it from the contents of the file using regex
  // if not found throw an error
  // get the corresponding OnlineJudge for the Url using OnlineJudge Factory
  // once we have the corresponding url, call "submit" method of OnlineJudge
}
