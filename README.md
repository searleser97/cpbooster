# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/cpbooster.svg)](https://badge.fury.io/js/cpbooster)

### Competitive Programming Booster

## About

`cpbooster` is a cross-platform command line utility designed to give competitive programmers a **boost** when participating in competitive programming contests.
Its simplicity makes it perfect to be used in any coding environment since it is simply a console command. _Vim_ users could just add a mapping to some of its commands to **boost** their speed even more.

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

**Note**: Run `cpbooster <command> --help` to display help for a specific command.

## Requirements

-   NodeJs
-   [Competitive Companion plugin](https://github.com/jmerle/competitive-companion)
-   Configuration File `cpbooster-config.json` (described below)

## Installation

1. Run:

```shell
  [sudo] npm install cpbooster -g
```

2. Run:

```shell
  [sudo] cpbooster new
```

3. Edit the configuration file created in your home directory according to your needs.
4. You are now all set up to use `cpbooster`.

## Configuration File Options

```jsonc
{
    "contestsDirectory": "/home/user/Contests",
    "cppTemplatePath": "/home/user/template.cpp",
    "cppCompileCommand": "g++ -std=gnu++17 -fconcepts",
    "cppDebugCommand": "g++ -std=gnu++17 -DDEBUG -fconcepts",
    "pyTemplatePath": "~/template.py",
    "pyRunCommand": "python3",
    "port": 1327,
    "terminal": "konsole"
}
```

## Features

- Automatically clone sample testcases files to specified directory
- Automatically create source files with the desired template in them
- Test your code against sample testcases quickly (AC, WA, RTE)
- Run your code with debugging flags easily with automated functionality

### Support to open directory in terminal after `cpbooster serve`

-   Konsole
-   xterm
-   gnome-terminal
-   deepin-terminal

## Future updates

-   Add support for java and python
-   Add support for more terminals
-   Build Vim native plugin

## License

`cpbooster` is licensed under the [GNU General Public License v3.0](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
