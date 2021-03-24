# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/cpbooster.svg#)](https://badge.fury.io/js/cpbooster)

### Competitive Programming Booster

## About

`cpbooster` is a cross-platform **CLI** tool designed to **boost** competitive programmer's speed during contests by automating various routine tasks like compiling and testing, debugging, cloning testcases, loading template, etc. The console command suits any coding environment (i.e. _**VSCode, Jetbrains IDEs, Vim, Emacs, Geany, Sublime Text, ...**_) and it’s very easy to use. _Vim_ users can install [cpbooster.vim plugin](https://github.com/searleser97/cpbooster.vim) to **boost** their speed even more.

- Using **Vim**: <img src="https://searleser97.gitlab.io/competitive-programming-notes/cpbooster/cpbooster.gif"/>
- Using **VSCode**: <img src="https://searleser97.gitlab.io/competitive-programming-notes/cpbooster/cpbooster_vscode.gif"/>

## Features

1. `cpbooster` comes with a short alias command called `cpb` to avoid writing the long command each time
1. Automatically clone sample testcases files with corresponding source code files with template loaded into a desired directory
   - `cpb clone` waits for competitive companion plugin to send parsed data for each problem
1. Create source files with corresponding template loaded
   - `cpb create a.py` creates single file with corresponding template loaded based on file extension
   - `cpb create {a..n}.cpp` creates multiple consecutive files from "a.cpp" to "n.cpp"
   - `cpb create {a...n}.cpp` same as previous command (Any amount of dots greater than 1 work)
   - `cpb create {a-n}.cpp` same as previous command (Single dash also works)
   - `cpb create /some/path/a.cpp` creates "a.cpp" in the specified path instead of current location
   - `cpb create /some/path/{a-n}.cpp` creates "a.cpp ... n.cpp" in the specified path instead of current location
1. Test your code against sample testcases quickly

   - `cpb test mycode.cpp` test your program against all available test cases
   - `cpb test mycode.cpp -t 1` test your program against the test case with the given id
   - `cpb test /some/path/mycode.cpp` test a program that is not located in your current location

   Supported results:

   - **AC** (Accepted)
   - **WA** (Wrong Answer) Shows differences between accepted output and your output beautifully
   - **TLE** (Time Limit Exceeded)
   - **RTE** (Runtime Error)
   - **CE** (Compilation Error)

1. Run code with your own debugging flags easily
   - `cpb test mycode.cpp -d` to use keyboard as input
   - `cpb test mycode.cpp -t 2 -d` to use a test case file as input
   - `cpb test /some/path/mycode.cpp -d` debug a program that is not located in your current location
1. Submit your code from the terminal really quickly.
   - `cpb submit mycode.cpp` submits your file to the corresponding judge.
1. open a new terminal in the contest directory immediately after cloning it

   - List of **supported terminals** for this feature:
     - konsole
     - xterm
     - gnome-terminal
     - deepin-terminal
     - terminal (MacOS)
     - kitty
     - vscode
       - I recommend adding this setting to your vscode `settings.json` so that green doesn't look to bright:
         `"workbench.colorCustomizations" : { "terminal.ansiGreen":"#5b8a3a" }`

1. Vim plugin [cpbooster.vim](https://github.com/searleser97/cpbooster.vim) **boosts** your speed even more

## Installation Requirements

- Node.js >= v12.18.2
- [Competitive Companion plugin](https://github.com/jmerle/competitive-companion)
- Configuration File `cpbooster-config.json` (described below)

## Installation Instructions

1. Run:

```shell
  npm install cpbooster -g
```

**Note:** In some cases you may need to run above command with `sudo`.

2. Run:

```shell
  cpbooster init
```

or

```shell
  cpb init
```

3. Edit the configuration file created in your home directory according to your needs.
4. You are now all set up to use `cpbooster`.

## Configuration File Options

```jsonc
{
  "contestsDirectory": "/home/user/Contests",
  "cppTemplatePath": "/home/user/template.cpp",
  "cppCompileCommand": "g++ -std=gnu++17 -O2",
  "cppDebugCommand": "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall",
  "pyTemplatePath": "/home/user/template.py",
  "pyRunCommand": "python3",
  "preferredLang": "cpp", // use extension name like: cpp, py, java
  "port": 1327, // must match with competitive companion plugin port
  "terminal": "konsole",
  // the following option just applies if the terminal supports opening a new terminal
  // after cloning a contest
  "closeAfterClone": false // whether or not to close current terminal
}
```

## General Usage `cpbooster --help`

```
Usage: cpb <command> [options]

Run `cpb <command> --help` to show help for an specific command.

Commands:
  cpb clone              Run cpbooster as server for competitive companion
                         plugin.
  cpb test <filePath>    Test your code against one or all (default) available
                         test cases. Run `cpb test --help` to see more usage
                         options                                    [aliases: t]
  cpb create <filePath>  Creates new source code file with the corresponding
                         template loaded or multiple source files if a sequence
                         is given as file name. Run `cpb create --help` to see
                         usage options and examples                 [aliases: c]
  cpb init               Creates a new configuration file with default values in
                         $HOME directory or if --config is specified, it writes
                         it in the given path.                      [aliases: i]

Options:
  --version, -v  Show version number                                   [boolean]
  --help, -h     Show help                                             [boolean]
  --config       Path to JSON configuration file
                 [default: "/home/san/cpbooster-config.json"]]
```

**Note:** `cpb` is the short alias for `cpbooster`.

## Future updates

- Add the possibility to test interactive problems
- Add the possibility to test current file using test cases of another file (test --as \<filename>)
- Add the possibility to debug current file using test cases of another file (test --as \<filename> -d)
- Add support for Java
- Add full support for more terminals
- Fully support windows CMD.
- Add Stress tests (using brute force solution and tests generator)

## Final Notes

- I am open to feature requests.
- Pull Requests are also welcome.

## License

`cpbooster` is licensed under the [GNU General Public License v3.0](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
