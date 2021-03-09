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

import {
  Browser,
  chromium,
  ChromiumBrowser,
  ChromiumBrowserContext,
  Page
} from "playwright-chromium";
import * as fs from "fs";
import * as Path from "path";
import * as os from "os";
import { exit } from "process";

export default abstract class OnlineJudge {
  readonly storagePath = Path.join(os.homedir(), ".cpbooster/cpbooster-storage.json");
  readonly cpboosterHome = Path.join(os.homedir(), ".cpbooster");

  abstract readonly loginUrl: string;

  abstract isLoggedIn(page: Page): Promise<boolean>;

  // if not logged in, it should call `login()` and then continue with the submission
  abstract submit(url: string, filePath: string): Promise<boolean>;

  async restoreSession(browser: ChromiumBrowser): Promise<ChromiumBrowserContext> {
    const previousSession = fs.existsSync(this.storagePath);
    if (previousSession) {
      const storageString = fs.readFileSync(this.storagePath).toString();
      const parsedStorage = JSON.parse(storageString);
      const context = await browser.newContext({
        storageState: parsedStorage,
        userAgent: "chrome"
      });
      context.addCookies(parsedStorage);
      return context;
    } else {
      return await browser.newContext({
        userAgent: "chrome"
      });
    }
  }

  async saveSession(context: ChromiumBrowserContext): Promise<void> {
    const localStorageAndCookies = await context.cookies();
    console.log(localStorageAndCookies);
    if (!fs.existsSync(this.cpboosterHome)) {
      fs.mkdirSync(this.cpboosterHome, { recursive: true });
    }
    fs.writeFile(this.storagePath, JSON.stringify(localStorageAndCookies, null, 2), async (err) => {
      if (err) {
        console.log("Session information could not be written in", this.storagePath);
      }
    });
  }

  async closeAllOtherTabs(context: ChromiumBrowserContext): Promise<void> {
    const pages = context.pages();
    for (let i = 1; i < pages.length; i++) {
      pages[i].close();
    }
  }

  async login(): Promise<void> {
    let browser = await chromium.launch({ headless: false });
    const context = await this.restoreSession(browser);
    console.log(await context.storageState());

    const pages = context.pages();
    let page = pages.length > 0 ? pages[0] : await context.newPage();

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
    await this.saveSession(context);
    await browser.close();
  }
}
