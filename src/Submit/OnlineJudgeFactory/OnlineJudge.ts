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
import * as fs from "fs";
import * as Path from "path";
import * as os from "os";
import { exit } from "process";

export default abstract class OnlineJudge {
  readonly cookiesPath = Path.join(os.homedir(), ".cpbooster/cpbooster-cookies.json");
  readonly cpboosterHome = Path.join(os.homedir(), ".cpbooster");

  abstract readonly loginUrl: string;

  abstract isLoggedIn(page: Page): Promise<boolean>;

  // if not logged in, it should call `login()` and then continue with the submission
  abstract submit(url: string, filePath: string): Promise<boolean>;

  async login(): Promise<void> {
    const browser = await launch({ headless: false, defaultViewport: undefined });
    const pages = await browser.pages();
    let page = pages.length > 0 ? pages[0] : await browser.newPage();

    browser.on("targetcreated", async function () {
      const pages = await browser.pages();
      if (pages.length > 1) {
        for (let i = 1; i < pages.length; i++) {
          pages[i].close();
        }
        page = pages[0];
      }
    });

    const previousSession = fs.existsSync(this.cookiesPath);
    if (previousSession) {
      const cookiesString = fs.readFileSync(this.cookiesPath).toString();
      const parsedCookies = JSON.parse(cookiesString);
      if (parsedCookies.length !== 0) {
        for (let cookie of parsedCookies) {
          await page.setCookie(cookie);
        }
      }
    }
    try {
      await page.goto(this.loginUrl);

      while (!(await this.isLoggedIn(page))) {
        if (page.url() !== this.loginUrl) {
          await page.goto(this.loginUrl);
        }
        await page.waitForNavigation({ timeout: 0 });
      }
      console.log("Succesful login!");
    } catch (e) {
      console.log("Unsuccesful login!");
      exit(0);
    }
    const cookies = await page.cookies();
    if (!fs.existsSync(this.cpboosterHome)) {
      fs.mkdirSync(this.cpboosterHome, { recursive: true });
    }
    fs.writeFile(this.cookiesPath, JSON.stringify(cookies, null, 2), (err) => {
      if (err) {
        console.log("Session information could not be written in", this.cookiesPath);
      }
    });
    await browser.close();
  }
}
