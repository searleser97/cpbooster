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
import CompiledTester from "./CompiledTester";
import { exit } from "process";
import * as fs from "fs";
import InterpretedTester from "./InterpretedTester";
import Tester from "./Tester";
import { LangExtensions } from "../../Utils/LangExtensions";
import Util from "../../Utils/Util";

export default class TesterFactory {
  static compiledExtensions = new Set([
    LangExtensions.cpp.toString(),
    LangExtensions.c.toString(),
    LangExtensions.csharp.toString(),
    LangExtensions.go.toString()
  ]);

  static interpretedExtensions = new Set([
    LangExtensions.python.toString(),
    LangExtensions.javascript.toString(),
    LangExtensions.ruby.toString()
  ]);

  static getTester(config: Config, filePath: string): Tester {
    if (!fs.existsSync(filePath)) {
      console.log("File not found:", filePath);
      exit(0);
    }

    const langExtension = Util.getExtensionName(filePath);

    if (
      config.languages[langExtension]?.type === "compiled" ||
      this.compiledExtensions.has(langExtension)
    ) {
      return new CompiledTester(config, filePath);
    } else if (
      config.languages[langExtension]?.type === "interpreted" ||
      this.interpretedExtensions.has(langExtension)
    ) {
      return new InterpretedTester(config, filePath);
    } else {
      console.log("Language not supported");
      exit(0);
    }
  }
}
