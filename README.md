# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
### Competitive Programming Booster
## About

`cpbooster` is a cross-platform command line utility designed to give competitive programmers a **boost** when participating in competitive programming contests.
Its simplicity makes it perfect to be used in any coding environment since it is simply a console command.

## Usage
```shell
Commands:
  cpbooster [options]  run cpbooster as server for competitive companion plugin

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  --configPath, -c   Path to read/write configuration file              [string]
  --test, -t         Run {program} against all available testcases or specific
                     testcase if [--testid] option is provided          [string]
  --debug, -d        Use this flag if you want to run [--test] using the "Debug
                     Command" specified in your configuration file.    [boolean]
  --testid, --tid    Specifies which testcase to run                    [number]
  --new, -n          Creates new configuration file with default values in
                     /home/$USER or if [--configPath] option is provided it
                     writes it in the specified path                   [boolean]
  --noCompile, --nc  Test with out compiling source (assumes there is a
                     corresponding binary file already)                [boolean]
```
## Requirements