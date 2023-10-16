/*
    cpbooster "Competitive Programming Booster"
    Copyright (C) 2023  user202729

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
import * as fs from "fs";

export default class UniversalOJ extends OnlineJudge {
  readonly onlineJudgeName = OnlineJudgeName.universaloj;
  readonly loginUrl = "https://contest.ucup.ac/login";
  readonly blockedResourcesOnSubmit: Set<string> = new Set([
    "image",
    "stylesheet",
    "font"
  ]);

  async isLoggedIn(page: Page): Promise<boolean> {
    return (await page.locator('a[href*="/logout"]').count()) !== 0;
  }

  async uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean> {
    try {
      await page.locator('a[href="#tab-submit-answer"]').click();
      await page.locator('input[type=radio][value=file][name="answer_answer_upload_type"]').setChecked(true);
      await page.locator("input[type=file][name=answer_answer_file]").setInputFiles(filePath);
      await page.locator("select[name=answer_answer_language]").selectOption(langAlias);
      await page.locator('form button[type=submit][name="submit-answer"]').click();
      await page.waitForLoadState("domcontentloaded");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
