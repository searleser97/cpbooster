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
import yargs, { argv, option } from "yargs";
import ICLIOptions from "./ICLIOptions";
import { exit } from "process";
import TesterFactory from "./TesterFactory/TesterFactory";

yargs
    .usage("Usage: $0 <command> [options]")
    .command("serve", "Run cpbooster as server for competitive companion plugin", (serve_yargs) => {
        serve_yargs.usage("Usage: $0 serve [options]").option("port", {
            alias: "p",
            type: "number",
            description:
                "Port where competitive companion plugin will send parsed data from problems"
        });
    })
    .command(
        "test",
        "Run {program} against all available testcases or specific testcase if [--testid] option is set",
        (test_yargs) => {
            test_yargs
                .usage("Usage: $0 test <filepath> [options]")
                .option("debug", {
                    alias: "d",
                    type: "boolean",
                    description:
                        'Use this flag if you want to run [--test] using the "Debug Command" specified in your configuration file.'
                })
                .option("testid", {
                    alias: "t",
                    type: "number",
                    description: "Specifies which testcase to run"
                })
                .option("noCompile", {
                    alias: "nc",
                    type: "boolean",
                    description:
                        "Test with out compiling source (assumes there is a corresponding binary file already)"
                });
        }
    )
    .command(
        "new",
        "Creates new configuration file with default values in /home/$USER or, if [--configPath] option is set it writes in the specified path",
        (new_yargs) => {
            new_yargs.usage("Usage: $0 new [options]");
        }
    )
    .help("help")
    .alias("help", "h")
    .alias("version", "v")
    .option("configPath", {
        alias: "c",
        type: "string",
        description: "Path to read/write configuration file"
    })
    .argv;

let config = new Config();
let options = <ICLIOptions>argv;
if (options.configPath) {
    config.read(options.configPath);
} else {
    config.read();
}

if (argv._[0] === "serve") {
    if (options.port) {
        config.port = options.port;
    }
    new Receiver(config).run();
} else if (argv._[0] === "test") {
    if (argv._.length < 2) {
        console.log("Missing program file in arguments");
        exit(0);
    }
    let tester = TesterFactory.getTester(config, argv._[1]);
    if (options.debug) {
        if (options.testid)
            tester.debugOne(options.testid, !options.noCompile);
        else
            tester.debugWithUserInput(!options.noCompile);
    } else {
        if (options.testid)
            tester.testOne(options.testid, !options.noCompile);
        else
            tester.testAll(!options.noCompile);
    } 
} else if (argv._[0] === "new") {
    if (options.configPath) {
        config.write(options.configPath);
    } else {
        config.write();
    }
} else {
    yargs.showHelp();
}
