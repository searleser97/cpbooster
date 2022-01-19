/*
    cpbooster "Competitive Programming Booster"
    Copyright (C) 2022  ???

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

export default class CS3233 extends OnlineJudge {
  readonly onlineJudgeName = OnlineJudgeName.szkopul;
  readonly loginUrl = "https://szkopul.edu.pl/login/";
  readonly blockedResourcesOnSubmit: Set<string> = new Set([
    "image",
    "stylesheet",
    "font",
    "script"
  ]);

  async isLoggedIn(page: Page): Promise<boolean> {
    const querySelector = '[data-post-url="/logout/"]';
    return (await page.$(querySelector)) !== null;
  }

  async uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean> {
    try {
      const inputFile = await page.$("input#id_file[type=file]");
      if(inputFile) await inputFile.setInputFiles(filePath); else return false;
	  await page.click('button[type=submit]');
      await page.waitForLoadState("domcontentloaded");
	  return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
