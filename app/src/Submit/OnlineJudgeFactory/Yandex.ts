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
import OnlineJudge, { OnlineJudgeName } from "./OnlineJudge";

export default class Yandex extends OnlineJudge {
  readonly onlineJudgeName = OnlineJudgeName.yandex;
  readonly loginUrl = "https://official.contest.yandex.com/login";
  readonly blockedResourcesOnSubmit: Set<string> = new Set(["image", "stylesheet", "font"]);

  async isLoggedIn(page: Page): Promise<boolean> {
    const querySelector = "form[action*=logout]";
    return (await page.$(querySelector)) !== null;
  }

  async uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean> {
    try {
      await page.selectOption("select", { value: langAlias });
      await page.click("input[value=file]")
      const inputFile = await page.$("input[type=file]");
      if (inputFile) await inputFile.setInputFiles(filePath);
      await page.click("div.problem__send > button");
      await page.waitForLoadState("load");
      if ((await page.$("div[class*=msg_type_warn]")) !== null) {
        console.log("\nYou have submitted exactly the same code before\n");
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
}
