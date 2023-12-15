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
import OnlineJudge from "./OnlineJudge";
import { OnlineJudgeName } from "../../Config/Types/OnlineJudgeName";

export default class TLX extends OnlineJudge {
  readonly onlineJudgeName = OnlineJudgeName.tlx;
  readonly loginUrl = "https://tlx.toki.id/login";
  readonly blockedResourcesOnSubmit: Set<string> = new Set(["image", "font"]);

  async isLoggedIn(page: Page): Promise<boolean> {
    const querySelector = "a[href='/login']";
    return (await page.$(querySelector)) === null;
  }

  async uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean> {
    const inputFileOrError = await page.locator(
      "div.programming-problem-worksheet form input[type=file][name='sourceFiles.source'], " +
        "[data-key=reason-not-allowed-to-submit]"
    );
    if ((await inputFileOrError.getAttribute("data-key")) === "reason-not-allowed-to-submit") {
      console.log(await inputFileOrError.innerText());
      return false;
    }
    const inputFile = inputFileOrError;
    await inputFileOrError.setInputFiles(filePath);
    await page
      .locator("div.programming-problem-worksheet form button[data-key=gradingLanguage]")
      .click();
    const languageSelector = page
      .locator(
        "div.programming-problem-worksheet div.bp4-popover div.bp4-popover-content a[data-key]"
      )
      .filter({ hasText: langAlias });
    await languageSelector.waitFor({ state: "visible" });
    await languageSelector.click();
    await languageSelector.waitFor({ state: "hidden" });

    await page.locator("div.programming-problem-worksheet form button[type=submit]").click();
    await page.waitForLoadState("domcontentloaded");

    return true;
  }
}
