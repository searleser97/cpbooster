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
import ITester from "./ITester";
import Config from "../Config";
import Util from "../Util";

export default class PyTester implements ITester {
    config: Config;
    filePath: string;
    constructor(config: Config, filePath: string) {
        this.config = config;
        this.filePath = filePath;
    }

    testOne(testId: number, compile: boolean): void {
        Util.runTest(
            this.config.pyRunCommand.split(" ")[0],
            [this.filePath],
            this.filePath,
            testId
        );
    }

    testAll(compile: boolean): void {
        let testcasesIds = Util.getTestCasesIdsForFile(this.filePath);
        for (let i = 0; i < testcasesIds.length; i++) {
            this.testOne(testcasesIds[i], false);
        }
    }

    debugOne(testId: number, compile: boolean): void {
        Util.runDebug(
            this.config.pyRunCommand.split(" ")[0],
            [this.filePath],
            this.filePath,
            testId
        );
    }

    debugWithUserInput(compile: boolean): void {
        Util.runDebugWithUserInput(this.config.pyRunCommand.split(" ")[0], [this.filePath]);
    }
}
