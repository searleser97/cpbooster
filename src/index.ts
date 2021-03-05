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
import { ICommandServeArgs, serve } from "./Serve/Serve";
import { ICommandTestArgs, test } from "./Test/Test";
import { create, ICommandCreateArgs } from "./Create/Create";
import { init } from "./Init/Init";

const pkg = require("../package.json");
updateNotifier({
  pkg: pkg,
  shouldNotifyInNpmScript: true,
  updateCheckInterval: 1000 * 60 * 60 * 2
}).notify({
  isGlobal: true,
  defer: false
});

let descriptions = {
  serve: "Run cpbooster as server for competitive companion plugin.",
  test: "Test your code against one or all available test cases.",
  create:
    "Creates new source code file with the corresponding template loaded or multiple source files if a sequence is given as file name.",
  init:
    "Creates new configuration file with default values in $HOME or, if --configPath option is set, it writes it in the specified path."
};

yargs
  .usage(
    "\nUsage: $0 <command> [options]\n\nRun `$0 <command> --help` to show help for an specific command."
  )
  .command(
    "serve",
    descriptions.serve,
    (serve_yargs) => {
      serve_yargs.usage("\n" + descriptions.serve + "\nUsage: $0 serve [options]").option("port", {
        alias: "p",
        type: "number",
        description: "Port where competitive companion plugin will send parsed data from problems"
      });
    },
    (argv) => serve((argv as unknown) as ICommandServeArgs)
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
            "\n* If --testId flag is set, it will use the given test case as input" +
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
    descriptions.create + " Run `cpb create --help` to see usage options",
    (create_yargs) => {
      create_yargs
        .usage(
          "\n" +
            descriptions.create +
            "\n\nUsage 1: $0 create <sourceCodePath>" +
            "\n  examples:\n" +
            "    $0 create sourcefile.cpp\n" +
            "    $0 create /home/cpbooster/sourcefile.cpp\n" +
            "\nUsage 2: $0 create <DirectoryPath>/{from(-|..)to}<extension>" +
            "\n  examples:\n" +
            "    $0 create {a-d}.cpp\n" +
            "    $0 create {a..d}.cpp\n" +
            "    $0 create /home/cpbooster/{a..d}.cpp\n"
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
        .usage("\n" + descriptions.init + "\n\nUsage: $0 new [options]")
        .config(
          "config",
          "Path where the JSON configuration file will be created" +
            `\n[default: "${Path.join(os.homedir(), "cpbooster-config.json")}"]`
        );
    },
    (argv) => init((argv as unknown) as ICommandGlobalArgs)
  )
  .help("help")
  .alias("help", "h")
  .alias("version", "v")
  .demandCommand()
  .strict()
  .config(
    "config",
    "Path to JSON configuration file" +
      `\n[default: "${Path.join(os.homedir(), "cpbooster-config.json")}"]`
  ).argv;
