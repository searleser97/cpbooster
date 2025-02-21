# cpbooster &middot; [![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/searleser97/cpbooster/blob/master/LICENSE) [![npm version](https://badge.fury.io/js/cpbooster.svg#)](https://badge.fury.io/js/cpbooster) ![npm](https://img.shields.io/npm/dt/cpbooster)

### Link to Website 🡲 https://searleser97.github.io/cpbooster/

## About

`cpbooster` is a cross-platform **CLI** tool designed to **boost** competitive programmer's speed during contests by automating various routine tasks like compiling and testing, debugging, cloning testcases, loading template, etc. The console command suits any coding environment (i.e. _**VSCode, Jetbrains IDEs, Vim, Emacs, Geany, Sublime Text, ...**_) and it’s very easy to use. _Vim_ / _NeoVim_ users can install [cpbooster.vim plugin](https://github.com/searleser97/cpbooster.vim) to **boost** their speed even more.

#### Using **NeoVim**:
![video-demo-min](https://user-images.githubusercontent.com/5056411/112361632-3874dd80-8c99-11eb-8734-95662003b8cf.gif)


## For Installation and Setup Instructions Visit `cpbooster` [Website](https://searleser97.github.io/cpbooster/)

**https://searleser97.github.io/cpbooster/**

## Features

1. `cpbooster` comes with a short alias command called `cpb` to avoid writing the long command each time
1. Automatically **clone** sample testcases files with corresponding source code files with template loaded into a desired directory
   - `cpb clone` waits for competitive companion plugin to send parsed data for each problem
1. **Test** your code against sample testcases quickly

   - `cpb test mycode.cpp` test your program against all available test cases
   - `cpb test mycode.cpp -t 1` test your program against the test case with the given id
   - `cpb test /some/path/mycode.cpp` test a program that is not located in your current location

   Supported results:

   - **AC** (Accepted)
   - **WA** (Wrong Answer) Shows differences between accepted output and your output beautifully
   - **TLE** (Time Limit Exceeded)
   - **RTE** (Runtime Error)
   - **CE** (Compilation Error)

1. Run code with your own **debugging flags** easily
   - `cpb test mycode.cpp -d` to use keyboard as input
   - `cpb test mycode.cpp -t 2 -d` to use a test case file as input
   - `cpb test /some/path/mycode.cpp -d` debug a program that is not located in your current location
1. **Submit** your code from the terminal really quickly.
   - `cpb submit mycode.cpp` submits your file to the corresponding judge.
1. open your preferred editor in the contest directory immediately after cloning it. See [Editors](https://searleser97.github.io/cpbooster/docs/configuration/#editor-string)

1. **Create** source files with corresponding template loaded
   - `cpb create a.py` creates single file with corresponding template loaded based on file extension
   - `cpb create {a..n}.cpp` creates multiple consecutive files from "a.cpp" to "n.cpp"
   - `cpb create {a...n}.cpp` same as previous command (Any amount of dots greater than 1 work)
   - `cpb create {a-n}.cpp` same as previous command (Single dash also works)
   - `cpb create /some/path/a.cpp` creates "a.cpp" in the specified path instead of current location
   - `cpb create /some/path/{a-n}.cpp` creates "a.cpp ... n.cpp" in the specified path instead of current location

1. Vim plugin [cpbooster.vim](https://github.com/searleser97/cpbooster.vim) **boosts** your speed even more

1. Flat File Structure. See [Why Flat File Structure](https://searleser97.github.io/cpbooster/docs/clone/#why-flat-file-structure)

1. Supports any programming language.

## How to Contribute

1. Fork this repository and clone it locally: `git clone https://github.com/{yourUsername}/cpbooster`
2. `cd` (change directory) to `cpbooster` repo directory
3. Install dependencies: run `npm install`
4. Install `cpbooster` from source: `npm run install:dev`
5. Make code changes

### Before making a Pull Request

1. Lint your code and fix possible linting errors: `npm run lint`
2. Verify all tests pass: `npm t`

### Recommended VSCode extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Future Updates (work not started yet, you can contribute by coding any of these features)

- add `--here` option to `cpb clone` to clone testcases in current directory
- Add Memory Limit Exceeded Veredict (using `gnu-time` as `/usr/bin/time -f '%M' ./program`, can't use `ps` due to lack of precision.
See https://stackoverflow.com/a/131346/13079132)
- Add the possibility to test interactive problems
- Add Stress tests (using brute force solution and tests generator)
- Add the possibility to test current file using test cases of another file (test --as \<filename> or `cpb test <sourcefile> --with \<testcases_filename>`)
- Add the possibility to debug current file using test cases of another file (test --as \<filename> -d)
- Fully support windows CMD.
- Add support for `NODE_ENV` in compile/debug command for debugging purposes.
- Refactor `DebugOne` and `DebugWithUserInput` functions.
- Open editor in created file right after executing `cpb create <filename>.<ext>`
- Add option per file type/language to not prepend the `// time-limit: xxx` comment on top of a file of specific type/language.
- Solve TODOs in code.


## Final Notes

- I am open to feature requests.
- Pull Requests are also welcome.

## License

`cpbooster` is licensed under the [GNU General Public License v3.0](https://github.com/searleser97/cpbooster/blob/master/LICENSE)
