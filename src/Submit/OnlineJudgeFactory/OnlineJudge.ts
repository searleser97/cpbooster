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

import { chromium, ChromiumBrowser, ChromiumBrowserContext, Page } from "playwright-chromium";
import * as fs from "fs";
import * as Path from "path";
import * as os from "os";
import { exit } from "process";

export default abstract class OnlineJudge {
  readonly cpboosterHome = Path.join(os.homedir(), ".cpbooster");

  // session cookies are stored in this file
  readonly sessionPath = Path.join(this.cpboosterHome, "cpbooster-session.json");

  abstract readonly loginUrl: string;

  abstract isLoggedIn(page: Page): Promise<boolean>;

  // if not logged in, it should call `login()` and then continue with the submission
  abstract submit(url: string, filePath: string): Promise<boolean>;

  // create `submitAssumingSessionExists` or something like that

  async restoreSession(browser: ChromiumBrowser): Promise<ChromiumBrowserContext> {
    const previousSession = fs.existsSync(this.sessionPath);
    const context = await browser.newContext({
      userAgent: "chrome",
      viewport: null
    });
    if (previousSession) {
      const sessionString = fs.readFileSync(this.sessionPath).toString();
      const parsedSession = JSON.parse(sessionString);
      context.addCookies(parsedSession);
    }
    return context;
  }

  async saveSession(context: ChromiumBrowserContext): Promise<void> {
    const cookies = await context.cookies();
    if (!fs.existsSync(this.cpboosterHome)) {
      fs.mkdirSync(this.cpboosterHome, { recursive: true });
    }
    fs.writeFile(this.sessionPath, JSON.stringify(cookies, null, 2), async (err) => {
      if (err) {
        console.log("Session information could not be written in", this.sessionPath);
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

    context.on("page", (_) => this.closeAllOtherTabs(context));
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
      await this.saveSession(context);
      await browser.close();
    } catch (e) {
      console.log("Unsuccesful login!");
      exit(0); // this helps to avoid printing any further errors
    }
  }
}
