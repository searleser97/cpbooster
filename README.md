# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/cpbooster.svg)](https://badge.fury.io/js/cpbooster)

### Competitive Programming Booster

## About

`cpbooster` is a cross-platform **CLI** tool designed to **boost** competitive programmer's speed during contests. The console command suits any coding environment and it’s very simple to use. _Vim_ users can install [cpbooster.vim plugin](https://github.com/searleser97/cpbooster.vim) to **boost** their speed even more.

<img src="https://searleser97.gitlab.io/competitive-programming-notes/cpbooster/cpbooster.gif"/>

## Usage

```
Usage: cpbooster <command> [options]

Commands:
  cpbooster serve   Run cpbooster as server for competitive companion plugin
  cpbooster test    By default this command runs your <program> against all
                    available test cases, run 'cpbooster test --help' to get
                    information about more options
  cpbooster create  Creates new source code file with the corresponding template
                    loaded
  cpbooster new     Creates new configuration file with default values in $HOME
                    or, if --configPath option is set it writes in the specified
                    path

Options:
  --version, -v     Show version number                                [boolean]
  --help, -h        Show help                                          [boolean]
  --configPath, -c  Path to read/write configuration file               [string]
```

**Note:** Run `cpbooster <command> --help` to display help information about an specific command.

## Requirements

-   Node.js >= v12.18.2
-   [Competitive Companion plugin](https://github.com/jmerle/competitive-companion)
-   Configuration File `cpbooster-config.json` (described below)

## Installation

1. Run:

```shell
  npm install cpbooster -g
```

**Note:** In some cases you may need to run above command with `sudo`.

2. Run:

```shell
  cpbooster new
```

3. Edit the configuration file created in your home directory according to your needs.
4. You are now all set up to use `cpbooster`.

## Configuration File Options

```jsonc
{
    "contestsDirectory": "/home/user/Contests",
    "cppTemplatePath": "/home/user/template.cpp",
    "cppCompileCommand": "g++ -std=gnu++17",
    "cppDebugCommand": "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall",
    "pyTemplatePath": "/home/user/template.py",
    "pyRunCommand": "python3",
    "preferredLang": "cpp", // use extension name like: cpp, py, java
    "port": 1327, // must match with competitive companion plugin port
    "terminal": "konsole"
}
```

## Features

-   Automatically clone sample testcases files into an specific directory
-   Create source files from a template
-   Test your code against sample testcases quickly.  
    Supported results: AC (Accepted), WA (Wrong Answer), RTE (Runtime Error), CE (Compilation Error)
-   Run code with your own debugging flags easily

#### Support to open directory in terminal after `cpbooster serve`:

-   konsole
-   xterm
-   gnome-terminal
-   deepin-terminal

## Future updates

-   Add support for Java
-   Add full support for more terminals
-   Add configuration assistant
-   Fully support windows CMD.

## Final Notes

-   I am open to feature requests.
-   Pull Requests are also welcome.

## License

`cpbooster` is licensed under the [GNU General Public License v3.0](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
