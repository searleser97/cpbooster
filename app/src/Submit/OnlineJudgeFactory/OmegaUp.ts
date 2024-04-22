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

import { Page } from "playwright-chromium";
import OnlineJudge from "./OnlineJudge";
import { OnlineJudgeName } from "../../Config/Types/OnlineJudgeName";

export default class Codeforces extends OnlineJudge {
  readonly onlineJudgeName = OnlineJudgeName.omegaup;
  readonly loginUrl = "https://omegaup.com/login/";
  readonly blockedResourcesOnSubmit: Set<string> = new Set(["image", "font"]);

  async isLoggedIn(page: Page): Promise<boolean> {
    const querySelector = "a[href*=logout]";
    return (await page.$(querySelector)) !== null;
  }

  async uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean> {
    try {
      await page.click("a[href*=new-run]");
      const inputFile = await page.$("input[type=file]");
      if (inputFile) await inputFile.setInputFiles(filePath);
      await page.selectOption("select", { value: langAlias });
      await page.click('button[type=submit][class="btn btn-primary"]');
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
