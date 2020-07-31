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
import Config from "../Config";
import { Veredict } from "../Veredict";
import Tester from "./Tester";

export default class PyTester extends Tester {

    constructor(config: Config, filePath: string) {
        super(config, filePath);
    }

    testOne(testId: number, compile: boolean): Veredict {
        return this.runTest(
            this.config.pyRunCommand.split(" ")[0],
            [this.filePath],
            testId
        );
    }

    debugOne(testId: number, compile: boolean): void {
        this.runDebug(
            this.config.pyRunCommand.split(" ")[0],
            [this.filePath],
            testId
        );
    }

    debugWithUserInput(compile: boolean): void {
        this.runDebugWithUserInput(this.config.pyRunCommand.split(" ")[0], [this.filePath]);
    }
}
