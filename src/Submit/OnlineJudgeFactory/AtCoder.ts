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

import { chromium, Page } from "playwright-chromium";
import OnlineJudge from "./OnlineJudge";

export default class AtCoder extends OnlineJudge {
  loginUrl: string = "https://atcoder.jp/login";

  async isLoggedIn(page: Page): Promise<boolean> {
    const querySelector = "a[href*=logout]";
    return (await page.$(querySelector)) !== null;
  }

  async submit(filePath: string, url: string): Promise<boolean> {
    let browser = await chromium.launch({ headless: true });
    const context = await this.restoreSession(browser);

    const pages = context.pages();
    let page = pages.length > 0 ? pages[0] : await context.newPage();

    const blockedResources = new Set(["image", "stylesheet", "font", "script"]);
    let isInterceptionEnabled = true;
    await page.route("**/*", (route) => {
      if (isInterceptionEnabled && blockedResources.has(route.request().resourceType())) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(url);

    if (!(await this.isLoggedIn(page))) {
      await this.login();
      await page.goto(url);
    }

    const inputFile = await page.$("input[type=file]");
    if (inputFile) await inputFile.setInputFiles("./A.Threeswimmers.cpp");

    isInterceptionEnabled = false;
    await page.selectOption("select", { value: "4003" });
    await page.screenshot({ path: "/home/san/Pictures/example1.png", fullPage: true });
    await page.click("#submit");
    // await page.waitForNavigation({ timeout: 0 });
    // await this.saveSession(context);
    // await page.screenshot({ path: "/home/san/Pictures/example2.png", fullPage: true });
    await browser.close();
    return false;
  }
}
