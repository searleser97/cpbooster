# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/cpbooster.svg)](https://badge.fury.io/js/cpbooster)

### Competitive Programming Booster

## About

`cpbooster` is a cross-platform **CLI** tool designed to **boost** competitive programmer's speed during contests by automating various routine tasks like testing, debugging, cloning testcases, etc. The console command suits any coding environment and it’s very simple to use. _Vim_ users can install [cpbooster.vim plugin](https://github.com/searleser97/cpbooster.vim) to **boost** their speed even more.

<img src="https://searleser97.gitlab.io/competitive-programming-notes/cpbooster/cpbooster.gif"/>

## Features

1. `cpbooster` comes with a short alias command called `cpb` to avoid writing the long command each time.
1. Automatically clone sample testcases files into an specific directory
   - `cpb serve` waits for competitive companion plugin to send parsed data for each problem
1. Create source files from a template
   - `cpb create b.py` creates single file with corresponding template loaded based on file extension
   - `cpb create {a..n}.cpp` creates multiple consecutive files from "a.cpp" to "n.cpp"
   - `cpb create {a...n}.cpp` same as previous command (Any amount of dots greater than 1 work)
   - `cpb create {a-n}.cpp` same as previous command (Single dash also works)
1. Test your code against sample testcases quickly.
   - `cpb test mycode.cpp` test your program against all available test cases
   - `cpb test mycode.cpp --testId 1` test your program against the test case with the given id.

   Supported results:
   - **AC** (Accepted)
   - **WA** (Wrong Answer) Shows differences between accepted output and your output beautifully
   - **TLE** (Time Limit Exceeded)
   - **RTE** (Runtime Error)
   - **CE** (Compilation Error)
1. Run code with your own debugging flags easily
   - `cpb test mycode.cpp --debug` to use keyboard as input
   - `cpb test mycode.cpp --debug --testId 2` to use a test case file as input
1. open a new terminal in the contest directory immediately after cloning it
   - List of **supported terminals** for this feature:
     - konsole
     - xterm
     - gnome-terminal
     - deepin-terminal
     - terminal (MacOS)
     - kitty
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
  cpbooster new
```
  or
```shell
  cpb new
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

Commands:
  cpb serve   Run cpbooster as server for competitive companion plugin
  cpb test    By default this command runs your <program> against all available
              test cases, run 'cpbooster test --help' to get information about
              more options
  cpb create  Creates new source code file with the corresponding template
              loaded or multiple source files if a sequence is given as file
              name, run 'cpbooster create --help' for more details
  cpb new     Creates new configuration file with default values in $HOME or, if
              --configPath option is set it writes it in the specified path

Options:
  --version, -v     Show version number                                [boolean]
  --help, -h        Show help                                          [boolean]
  --configPath, -c  Path to read/write configuration file               [string]
```

**Note:** Run `cpbooster <command> --help` to display help information about a specific command.

**Note 2:** `cpb` is the short alias for `cpbooster`.

## Future updates

- Add the possibility to test current file using test cases of another file (test --as \<filename>)
- Add the possibility to debug current file using test cases of another file (test --as \<filename> -d)
- Add support for Java
- Add full support for more terminals
- Fully support windows CMD.

## Final Notes

- I am open to feature requests.
- Pull Requests are also welcome.

## License

`cpbooster` is licensed under the [GNU General Public License v3.0](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
