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
import Config from "./Config";
import Receiver from "./Receiver";
import yargs, { argv } from "yargs";
import ICLIOptions from "./Types/ICLIOptions";
import { exit } from "process";
import TesterFactory from "./TesterFactory/TesterFactory";
import updateNotifier from "update-notifier";
import SourceFileCreator from "./SourceFileCreator";
import Tester from "./TesterFactory/Tester";

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
  serve: "Run cpbooster as server for competitive companion plugin",
  test:
    "By default this command runs your <program> against all available test cases, run 'cpbooster test --help' to get information about more options",
  create:
    "Creates new source code file with the corresponding template loaded or multiple source files if a sequence is given as file name," +
    " run 'cpbooster create --help' for more details",
  new:
    "Creates new configuration file with default values in $HOME or, if --configPath option is set it writes it in the specified path"
};

yargs
  .usage("\nUsage: $0 <command> [options]")
  .command("serve", descriptions.serve, (serve_yargs) => {
    serve_yargs.usage("\n" + descriptions.serve + "\n\nUsage: $0 serve [options]").option("port", {
      alias: "p",
      type: "number",
      description: "Port where competitive companion plugin will send parsed data from problems"
    });
  })
  .command("test", descriptions.test, (test_yargs) => {
    test_yargs
      .usage(
        "\n" +
          descriptions.test +
          "\n\nUsage: $0 test <program> [options]\n(where <program> is the path to your source code)"
      )
      .option("debug", {
        alias: "d",
        type: "boolean",
        description: 'Run <program> using the "Debug Command" specified in the configuration file'
      })
      .option("testId", {
        alias: "t",
        type: "number",
        description:
          'Specifies which testcase to evaluate, or if --debug flag is set it runs <program> with your "Debug Command" using --testId as input'
      })
      .option("noCompile", {
        alias: "nc",
        type: "boolean",
        description:
          "Test with out compiling source (assumes there is a corresponding binary file already)"
      })
      .option("add", {
        alias: "a",
        type: "boolean",
        description: "Adds new test case for <program>"
      });
  })
  .command("create", descriptions.create, (create_yargs) => {
    create_yargs.usage(
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
    );
  })
  .command("new", descriptions.new, (new_yargs) => {
    new_yargs.usage("\n" + descriptions.new + "\n\nUsage: $0 new [options]");
  })
  .help("help")
  .alias("help", "h")
  .alias("version", "v")
  .option("configPath", {
    alias: "c",
    type: "string",
    description: "Path to read/write configuration file"
  }).argv;

async function main() {
  let config = new Config();
  let options = <ICLIOptions>argv;

  if (argv._.length === 0) {
    yargs.showHelp();
    exit(0);
  }

  if (argv._[0] === "new") {
    if (options.configPath) {
      config.write(options.configPath);
    } else {
      config.write();
    }
    exit(0);
  }

  if (options.configPath) {
    config.read(options.configPath);
  } else {
    config.read();
  }

  if (argv._[0] === "serve") {
    if (!config.preferredLang) {
      console.log("Missing preferred language (preferredLang) key in configuration");
      exit(0);
    }
    if (options.port) {
      config.port = options.port;
    }
    new Receiver(config).run();
  } else if (argv._[0] === "test") {
    if (argv._.length < 2) {
      console.log("Missing program file in arguments");
      exit(0);
    }
    if (options.add) {
      await Tester.createTestCase(argv._[1]);
    } else {
      let tester = TesterFactory.getTester(config, argv._[1]);
      if (options.debug) {
        if (options.testId) tester.debugOne(options.testId, !options.noCompile);
        else tester.debugWithUserInput(!options.noCompile);
      } else {
        if (options.testId) tester.testOne(options.testId, !options.noCompile);
        else tester.testAll(!options.noCompile);
      }
    }
  } else if (argv._[0] === "create") {
    if (argv._.length < 2) {
      console.log("Missing file path in arguments");
      exit(0);
    }
    SourceFileCreator.create(argv._[1], config);
  } else {
    yargs.showHelp();
  }
}

main();
