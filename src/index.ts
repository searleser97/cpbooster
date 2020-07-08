#!/usr/bin/env node
import Config from "./Config";
import Receiver from "./Receiver";
import yargs, { argv } from "yargs";
import ICLIOptions from "./ICLIOptions";
import Tester from "./Tester";
import { exit } from "process";

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
    let tester = new Tester(config, argv._[1]);
    tester.run(!options.noCompile, options.debug, options.testid);
} else if (argv._[0] === "new") {
    if (options.configPath) {
        config.write(options.configPath);
    } else {
        config.write();
    }
} else {
    yargs.showHelp();
}
