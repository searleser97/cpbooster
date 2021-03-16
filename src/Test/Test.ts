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
import Tester from "./TesterFactory/Tester";
import TesterFactory from "./TesterFactory/TesterFactory";

export interface ICommandTestArgs extends ICommandGlobalArgs {
  filePath: string;
  testId?: number;
  debug?: boolean;
  noCompile?: boolean;
  add?: boolean;
}

export function test(args: ICommandTestArgs) {
  const config = Config.read(args.configPath);
  if (args.add) {
    Tester.createTestCase(args.filePath);
  } else {
    let tester = TesterFactory.getTester(config, args.filePath);
    if (args.debug) {
      if (args.testId) tester.debugOne(args.testId, !args.noCompile);
      else tester.debugWithUserInput(!args.noCompile);
    } else {
      if (args.testId) tester.testOne(args.testId, !args.noCompile);
      else tester.testAll(!args.noCompile);
    }
  }
}
