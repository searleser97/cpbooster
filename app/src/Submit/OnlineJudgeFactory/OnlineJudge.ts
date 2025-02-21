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
import { OnlineJudgeName } from "../../Config/Types/OnlineJudgeName";
import open from "open";
import Util from "../../Utils/Util";

type StorageState = {
  cookies: Array<{
    name: string;
    value: string;
    url: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "Strict" | "Lax" | "None";
  }>;
  origins: Array<{
    origin: string;
    localStorage: Array<{
      name: string;
      value: string;
    }>;
  }>;
};

const sessionFileVersion = "v2";

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

  /**
   * @param {string} filePath path to the source code file
   * @param {Page} page submission page, usually same as problem page
   * @param {string} langAlias Id of the language for the OnlineJudge.
   */
  abstract uploadFile(filePath: string, page: Page, langAlias: string): Promise<boolean>;

  getSession(): StorageState | undefined {
    const previousSession = fs.existsSync(this.sessionPath);
    if (!previousSession) return undefined;
    const sessionString = fs.readFileSync(this.sessionPath).toString();
    const parsedSession = JSON.parse(sessionString);
    if (!parsedSession || parsedSession.version !== sessionFileVersion) {
      console.log(
        `Version of session file ${this.sessionPath} is deprecated. Please login again to all sites.`
      );
      fs.unlinkSync(this.sessionPath);
      return undefined;
    }
    return parsedSession.data;
  }

  async restoreSession(browser: ChromiumBrowser): Promise<ChromiumBrowserContext> {
    const storageState = this.getSession();
    const options: {
      userAgent: string;
      viewport: null;
      storageState?: StorageState;
    } = {
      userAgent: "chrome",
      viewport: null
    };
    if (storageState) options.storageState = storageState;
    const context = await browser.newContext(options);
    return context;
  }

  async saveSession(context: ChromiumBrowserContext): Promise<void> {
    const storageState = await context.storageState();
    if (!fs.existsSync(GlobalConstants.cpboosterHome)) {
      fs.mkdirSync(GlobalConstants.cpboosterHome, { recursive: true });
    }
    fs.writeFile(
      this.sessionPath,
      JSON.stringify(
        {
          version: sessionFileVersion,
          data: storageState
        },
        null,
        2
      ),
      async (err) => {
        if (err) {
          console.log("Session information could not be written in", this.sessionPath);
        }
      }
    );
  }

  async closeAllOtherTabs(context: ChromiumBrowserContext): Promise<void> {
    const pages = context.pages();
    for (let i = 1; i < pages.length; i++) {
      pages[i].close();
    }
  }

  getLangAliasesObject(langExtension: string, config: Config): LangAliases | undefined {
    return config.languages[langExtension]?.aliases;
  }

  getLangAlias(filePath: string, config: Config): string | undefined {
    const lang = Util.getExtensionName(filePath);
    const langAliases = this.getLangAliasesObject(lang, config);
    return langAliases?.[this.onlineJudgeName as OnlineJudgeName];
  }

  async openBrowserInUrl(url: string, useUserDefaultBrowser: boolean): Promise<void> {
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

  async submit(filePath: string, url: string, config: Config, langAlias?: string): Promise<void> {
    if (!langAlias) {
      langAlias = this.getLangAlias(filePath, config);
      if (!langAlias) {
        console.log(
          `${this.onlineJudgeName} alias for "${Util.getExtensionName(
            filePath
          )}" was not found in config file.`
        );
        exit(0);
      }
    }

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
      await browser.close();
      await this.login();
      return await this.submit(filePath, url, config, langAlias);
    }

    try {
      const result = await this.uploadFile(filePath, page, langAlias);
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
      console.log(e);
      console.log("Error: File was not submitted");
      exit(0);
    }
  }
}
