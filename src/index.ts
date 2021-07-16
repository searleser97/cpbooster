#!/usr/bin/env node

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

import updateNotifier from "update-notifier";
import yargs from "yargs";
import * as os from "os";
import * as Path from "path";
import ICommandGlobalArgs from "./Types/ICommandGlobalArgs";
import { ICommandCloneArgs, clone } from "./Clone/Clone";
import { ICommandTestArgs, test } from "./Test/Test";
import { create, ICommandCreateArgs } from "./Create/Create";
import { init } from "./Init/Init";
import { ICommandLoginArgs, login } from "./Login/Login";
import { ICommandSubmitArgs, submit } from "./Submit/Submit";

const pkg = require("../package.json");
updateNotifier({
  pkg: pkg,
  shouldNotifyInNpmScript: true,
  updateCheckInterval: 1000 * 60 * 60 * 2
}).notify({
  isGlobal: true,
  defer: false
});

const descriptions = {
  clone: "Run cpbooster as server for competitive companion plugin.",
  test: "Test your code against one or all (default) available test cases.",
  create:
    "Create a new source code file with the corresponding template loaded or multiple source files if a sequence is given as file name.",
  init:
    "Create a new configuration file with default values in $HOME directory or if --configPath is specified, it writes it in the given path.",
  login: "Log in to the specified Online Judge (i.e. Codeforces, AtCoder, ...).",
  submit:
    "Submit a source code file as a solution to a problem in an Online Judge (i.e. Codeforces, AtCoder, ...)."
};

yargs
  .usage(
    "\nUsage: $0 <command> [options]\n\nRun `$0 <command> --help` to show help for an specific command."
  )
  .command(
    "clone",
    descriptions.clone,
    (serve_yargs) => {
      serve_yargs
        .usage("\n" + descriptions.clone + "\n\nUsage: $0 clone [options]")
        .option("port", {
          alias: "p",
          type: "number",
          description: "Port where competitive companion plugin will send parsed data from problems"
        });
    },
    (argv) => clone((argv as unknown) as ICommandCloneArgs)
  )
  .command(
    ["test <filePath>", "t"],
    descriptions.test + " Run `cpb test --help` to see more usage options",
    (test_yargs) => {
      test_yargs
        .usage(
          "\n" +
            descriptions.test +
            " Refer to the options section to see all possible usages of this command." +
            "\n\nUsage: $0 test <filePath> [options]"
        )
        .option("debug", {
          alias: "d",
          type: "boolean",
          description:
            'Runs program using the corresponding "Debug Command" specified in the configuration file.' +
            "\n* If --testId is specified, it will use the given test case as input" +
            "\n* Otherwise, it will read the input from keyboard" +
            "\n Note: If the language does not support debugging flags, this option will be ignored"
        })
        .option("testId", {
          alias: "t",
          type: "number",
          description: "Specifies which testcase to use as input"
        })
        .option("noCompile", {
          alias: "nc",
          type: "boolean",
          description:
            "Skip compilation of program (assumes there is a corresponding binary file already)." +
            "\n Note: If the language does not require compilation, this option will be ignored"
        })
        .option("add", {
          alias: "a",
          type: "boolean",
          description: "Adds new test case for the given <filePath>"
        })
        .fail((msg: string, _, yargs) => {
          yargs.showHelp();
          if (msg === "Not enough non-option arguments: got 0, need at least 1") {
            console.log("\nMissing <filePath> in arguments");
          } else {
            console.log("\n", msg);
          }
        });
    },
    (argv) => test((argv as unknown) as ICommandTestArgs)
  )
  .command(
    ["create <filePath>", "c"],
    descriptions.create + " Run `cpb create --help` to see usage options and examples",
    (create_yargs) => {
      create_yargs
        .usage(
          "\n" +
            descriptions.create +
            "\n\n* Usage 1: $0 create <filePath> [options]\n\n" +
            "    examples:\n" +
            "      > $0 create sourcefile.cpp\n" +
            "      > $0 create /home/cpbooster/sourcefile.py" +
            "\n\n* Usage 2: $0 create [DirectoryPath/]{from..to}<extension> [options]\n\n" +
            "    examples:\n" +
            "      > $0 create {a..d}.cpp (any amount of dots greater than 1 work)\n" +
            "      > $0 create /home/cpbooster/{a..d}.cpp\n" +
            "      > $0 create {a-d}.py (single dash also works)\n"
        )
        .fail((msg: string, _, yargs) => {
          yargs.showHelp();
          if (msg === "Not enough non-option arguments: got 0, need at least 1") {
            console.log("\nMissing <filePath> in arguments");
          } else {
            console.log("\n" + msg);
          }
        });
    },
    (argv) => create((argv as unknown) as ICommandCreateArgs)
  )
  .command(
    ["init", "i"],
    descriptions.init,
    (new_yargs) => {
      new_yargs
        .usage("\n" + descriptions.init + "\n\nUsage: $0 init [options]")
        .option("configPath", {
          type: "string",
          description:
            "Path where the JSON configuration file will be created" +
            `\n[default: "${Path.join(os.homedir(), "cpbooster-config.json")}"]`
        });
    },
    (argv) => init((argv as unknown) as ICommandGlobalArgs)
  )
  .command(
    ["login <url>", "l"],
    descriptions.login,
    (new_yargs) => {
      new_yargs
        .usage(
          "\n" +
            descriptions.login +
            " The name of the Online Judge can be given instead of <url>." +
            "\n\nUsage: $0 login <url>"
        )
        .fail((msg: string, _, yargs) => {
          yargs.showHelp();
          if (msg === "Not enough non-option arguments: got 0, need at least 1") {
            console.log("\nMissing <url> in arguments");
          } else {
            console.log("\n" + msg);
          }
        });
    },
    (argv) => login((argv as unknown) as ICommandLoginArgs)
  )
  .command(
    ["submit <filePath>", "s"],
    descriptions.submit,
    (new_yargs) => {
      new_yargs
        .usage("\n" + descriptions.submit + "\n\nUsage: $0 submit <filePath> [url]")
        .fail((msg: string, _, yargs) => {
          yargs.showHelp();
          if (msg === "Not enough non-option arguments: got 0, need at least 1") {
            console.log("\nMissing <filePath> in arguments");
          } else {
            console.log("\n" + msg);
          }
        });
    },
    (argv) => submit((argv as unknown) as ICommandSubmitArgs)
  )
  .help("help")
  .alias("help", "h")
  .alias("version", "v")
  .demandCommand()
  .strict()
  .option("configPath", {
    type: "string",
    description:
      "Path to JSON configuration file" +
      `\n[default: "${Path.join(os.homedir(), "cpbooster-config.json")}"]`
  }).argv;
