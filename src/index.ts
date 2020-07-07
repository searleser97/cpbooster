#!/usr/bin/env node
import Config from "./Config";
import Receiver from "./Receiver";
import yargs, { argv, option, boolean } from "yargs";
import ICLIOptions from "./ICLIOptions";
import Tester from "./Tester";

yargs
    .command("[options]", "run cpbooster as server for competitive companion plugin")
    .option("configPath", {
        alias: "c",
        type: "string",
        description: "Path to read/write configuration file"
    })
    .option("test", {
        alias: "t",
        type: "string",
        description:
            "Run {program} against all available testcases or specific testcase if [--testid] option is provided"
    })
    .option("debug", {
        alias: "d",
        type: "boolean",
        description:
            'Use this flag if you want to run [--test] using the "Debug Command" specified in your configuration file.'
    })
    .option("testid", {
        alias: "tid",
        type: "number",
        description: "Specifies which testcase to run"
    })
    .option("new", {
        alias: "n",
        type: "boolean",
        description:
            "Creates new configuration file with default values in /home/$USER or if [--configPath] option is provided it writes it in the specified path"
    })
    .option("noCompile", {
        alias: "nc",
        type: "boolean",
        description:
            "Test with out compiling source (assumes there is a corresponding binary file already)"
    }).argv;

let config = new Config();
let options = <ICLIOptions>argv;

// console.log(options);
if (options.new) {
    if (options.configPath) {
        config.write(options.configPath);
    } else {
        config.write();
    }
} else {
    if (options.configPath) {
        config.read(options.configPath);
    } else {
        config.read();
    }
    if (options.test) {
        let tester = new Tester(config, options.test);
        tester.run(!options.noCompile, options.debug, options.testid);
    } else {
        let recv = new Receiver(config);
        recv.run();
    }
}
