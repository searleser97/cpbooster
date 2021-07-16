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
import { exit } from "process";
import GlobalConstants from "../../GlobalConstants";
import Config from "../../Config/Config";
import { LangAliases } from "../../Config/Types/LangAliases";
import open from "open";

export enum OnlineJudgeName {
  codeforces = "codeforces",
  atcoder = "atcoder"
}

export default abstract class OnlineJudge {
  // session cookies are stored in this file
  readonly sessionPath = Path.join(GlobalConstants.cpboosterHome, "cpbooster-session.json");

  abstract readonly onlineJudgeName: string;
  abstract readonly loginUrl: string;

  /* unnecesary resources when submitting a file, (i.e. css, script, image, font, ...)
  visit: https://playwright.dev/docs/api/class-request#requestresourcetype to get
  the list of possible resource names. Blocking these resources reduces the time
  required per submission significantly */
  abstract readonly blockedResourcesOnSubmit: Set<string>;

  abstract isLoggedIn(page: Page): Promise<boolean>;

  abstract uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean>;

  getSession(): Array<{
    name: string;
    value: string;
    url?: string;
    domain?: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  }> {
    const sessionString = fs.readFileSync(this.sessionPath).toString();
    const parsedSession = JSON.parse(sessionString);
    return parsedSession;
  }

  async restoreSession(browser: ChromiumBrowser): Promise<ChromiumBrowserContext> {
    const previousSession = fs.existsSync(this.sessionPath);
    const context = await browser.newContext({
      userAgent: "chrome",
      viewport: null
    });
    if (previousSession) {
      context.addCookies(this.getSession());
    }
    return context;
  }

  async saveSession(context: ChromiumBrowserContext): Promise<void> {
    const cookies = await context.cookies();
    if (!fs.existsSync(GlobalConstants.cpboosterHome)) {
      fs.mkdirSync(GlobalConstants.cpboosterHome, { recursive: true });
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

  getExtensionName(filePath: string): string {
    return Path.extname(filePath).substr(1).toLowerCase();
  }

  getLangAliasesObject(lang: string, config: Config): LangAliases | undefined {
    switch (lang) {
      case "cpp":
        return config.languages.cpp?.aliases;
      case "py":
        return config.languages.py?.aliases;
      default:
        return undefined;
    }
  }

  getLangAlias(filePath: string, config: Config): string | undefined {
    const lang = this.getExtensionName(filePath);
    const langAliases = this.getLangAliasesObject(lang, config);
    /* TODO: make <key, value> object with Online Judge Name as key
             and langAliases as value. Then, we can iterate over it
             instead of writing one line per Online Judge */
    switch (this.onlineJudgeName) {
      case OnlineJudgeName.codeforces:
        return langAliases?.codeforces;
      case OnlineJudgeName.atcoder:
        return langAliases?.atcoder;
      default:
        return undefined;
    }
  }

  async openBrowserInUrl(url: string, useUserDefaultBrowser: boolean) {
    try {
      if (useUserDefaultBrowser) {
        await open(url);
      } else {
        const browser = await chromium.launch({ headless: false });
        const context = await this.restoreSession(browser);
        context.on("page", (_) => this.closeAllOtherTabs(context));
        const pages = context.pages();
        const page = pages.length > 0 ? pages[0] : await context.newPage();
        page.on("close", (_) => exit(0));
        await page.goto(url);
      }
    } catch (_) {
      // This line apparently never gets executed
      console.log("Browser closed");
    }
  }

  async login(): Promise<void> {
    const browser = await chromium.launch({ headless: false });
    const context = await this.restoreSession(browser);

    context.on("page", (_) => this.closeAllOtherTabs(context));
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

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

  async submit(filePath: string, url: string, config: Config, langAlias?: string) {
    const browser = await chromium.launch({ headless: true });
    const context = await this.restoreSession(browser);

    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    await page.route("**/*", (route) => {
      if (this.blockedResourcesOnSubmit.has(route.request().resourceType())) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto(url);

    if (!(await this.isLoggedIn(page))) {
      await this.login();
      await context.clearCookies();
      await context.addCookies(this.getSession());
      await page.goto(url);
    }

    try {
      let result: boolean;
      if (langAlias) {
        result = await this.uploadFile(filePath, page, langAlias);
      } else {
        const langAliasFromConfig = this.getLangAlias(filePath, config);
        if (langAliasFromConfig) {
          result = await this.uploadFile(filePath, page, langAliasFromConfig);
        } else {
          console.log(
            `${this.onlineJudgeName} alias for "${this.getExtensionName(
              filePath
            )}" was not found in config file.`
          );
          exit(0);
        }
      }
      if (result) {
        console.log("File submitted succesfully");
      } else {
        console.log("Error: File was not submitted");
      }
      await this.saveSession(context);
      await browser.close();
      if (result && config.showStatusPageOnSubmit) {
        try {
          // waiting for half a second also fixes the error:
          // -> route.continue: Target page, context or browser has been closedError
          // when you submit for the very first time after installing cpbooster
          //await new Promise((resolve) => setTimeout(resolve, 500));
          await this.openBrowserInUrl(page.url(), config.useUserDefaultBrowser);
        } catch (_) {
          // fixes the error: route.continue: Target page, context or browser has been closedError
          // when you submit for the very first time after installing cpbooster
          await this.openBrowserInUrl(page.url(), config.useUserDefaultBrowser);
        }
      }
    } catch (e) {
      console.log("Error: File was not submitted");
      exit(0);
    }
  }
}
