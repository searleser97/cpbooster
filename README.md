# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
### Competitive Programming Booster
## About

`cpbooster` is a cross-platform command line utility designed to give competitive programmers a **boost** when participating in competitive programming contests.
Its simplicity makes it perfect to be used in any coding environment since it is simply a console command.

## Usage
```
Usage: cpbooster <command> [options]

Commands:
  cpbooster serve  Run cpbooster as server for competitive companion plugin
  cpbooster test   Run {program} against all available testcases or specific
                   testcase if [--testid] option is provided
  cpbooster new    Creates new configuration file with default values in
                   /home/$USER or if [--configPath] option is provided it writes
                   it in the specified path

Options:
  --version, -v     Show version number                                [boolean]
  --help, -h        Show help                                          [boolean]
  --configPath, -c  Path to read/write configuration file               [string]
```
## Requirements

- 