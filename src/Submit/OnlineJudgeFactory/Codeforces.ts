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

import { launch, Page } from "puppeteer";
import OnlineJudge from "./OnlineJudge";
import * as fs from "fs";

export default class Codeforces extends OnlineJudge {
  loginUrl: string = "https://codeforces.com/enter";

  async isLoggedIn(page: Page): Promise<boolean> {
    const querySelector = "a[href*=logout]";
    return (await page.$(querySelector)) !== null;
  }

  async submit(filePath: string, url: string): Promise<boolean> {
    const browser = await launch({
      headless: false,
      args: [`--user-data-dir=/home/san/.cpbooster`]
    });
    browser.on("targetcreated", () => this.closeAllOtherTabs(browser));

    const pages = await browser.pages();
    let page = pages.length > 0 ? pages[0] : await browser.newPage();
    await this.loadPreviousSession(page);
    browser.on("disconnected", () => this.writeCurrentSession(page));
    browser.on("targetcreated", () => this.closeAllOtherTabs(browser));

    await page.setRequestInterception(true);
    const blockedResources = new Set(["image", "stylesheet", "font", "script"]);
    let isInterceptionEnabled = true;
    page.on("request", (request) => {
      if (isInterceptionEnabled && blockedResources.has(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url);

    if (!(await this.isLoggedIn(page))) {
      await this.login();
      await this.loadPreviousSession(page);
      await page.goto(url);
    }

    const inputFile = await page.$("input[type=file]");
    if (inputFile) await inputFile.uploadFile("./A.Threeswimmers.cpp");

    // await page.screenshot({ path: "/home/san/Pictures/example1.png", fullPage: true });
    isInterceptionEnabled = false;
    await page.click('input[style="width:10em;"][type=submit]');
    await page.waitForNavigation({ timeout: 0 });
    // await page.screenshot({ path: "/home/san/Pictures/example2.png", fullPage: true });
    // await browser.close();
    return false;
  }
}
