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

import Config from "../../Config/Config";
import { Veredict } from "../../Types/Veredict";
import Tester from "./Tester";

export default class InterpretedTester extends Tester {
  constructor(config: Config, filePath: string) {
    super(config, filePath);
  }

  testOne(testId: number, _compile: boolean): Veredict {
    const commandAsArray = this.getSegmentedCommand(this.langExtension, false);
    const { veredict, feedback } = this.getTestVeredict(
      commandAsArray[0],
      [...commandAsArray.slice(1), this.filePath],
      testId,
      () => ({ status: true, feedback: "" })
    );
    this.printTestResults(veredict, feedback, testId);
    return veredict;
  }

  debugOne(testId: number, _compile: boolean): void {
    const debugCommandAsArray = this.getSegmentedCommand(this.langExtension, true);
    this.runDebug(debugCommandAsArray[0], [...debugCommandAsArray.slice(1), this.filePath], testId);
  }

  debugWithUserInput(_compile: boolean): void {
    const debugCommandAsArray = this.getSegmentedCommand(this.langExtension, true);
    this.runDebugWithUserInput(debugCommandAsArray[0], [
      ...debugCommandAsArray.slice(1),
      this.filePath
    ]);
  }
}
