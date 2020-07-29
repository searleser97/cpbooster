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
import Util from "./Util";

export default class TestCaseCreator {

    static async create(filePath: string) {
        let maxTestCaseId = Math.max(...Util.getTestCasesIdsForFile(filePath));
        let thisTCId = maxTestCaseId + 1;
        console.log("\nPress ctrl+D to finish your input\n");
        console.log("Test Case Input:\n");
        let input = await Util.readToEOF();
        console.log("\nTest Case Correct Output:\n");
        let answer = await Util.readToEOF();
        fs.writeFileSync(Util.getInputPath(filePath, thisTCId), input);
        fs.writeFileSync(Util.getAnswerPath(filePath, thisTCId), answer);
        console.log("\nTest case", thisTCId, "written.");
    }
}
