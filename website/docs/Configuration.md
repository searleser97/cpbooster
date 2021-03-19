---
id: Configuration
title: Configuration
---

## Creating Your First Configuration File

Execute the following command to create a configuration file:

```shell
cpbooster init
```

This command will create a file called `cpbooster-config.json` in your **$HOME** directory with default values.
If you wish to create your configuration file somewhere else you can specify the path using `--configPath` flag.

## Configuration File Example

#### `cpbooster-config.json`

```json
{
  "contestsDirectory": "/home/user/Contests",
  "port": 1327,
  "editor": "konsole",
  "closeAfterClone": false,
  "showStatusPageOnSubmit": false,
  "preferredLang": "cpp",
  "languages": {
    "cpp": {
      "template": "template.cpp",
      "command": "g++ -std=gnu++17 -O2",
      "debugCommand": "g++ -std=gnu++17 -DDEBUG -Wshadow -Wall",
      "aliases": {
        "codeforces": "54",
        "atcoder": "4003"
      }
    },
    "py": {
      "template": "template.py",
      "command": "python3",
      "debugCommand": "python3 -O",
      "aliases": {
        "codeforces": "31",
        "atcoder": "4006"
      }
    }
  }
}
```

## Fields Description

### `contestsDirectory: string`

The path to the directory where contests folders will be created when you run `cpb clone`.

The directory of a user that has cloned 3 contests would look like this:

```txt
$ cd path/to/contests/directory
$ tree -L 1
.
├── AtCoder-AtCoderBeginnerContest194
├── AtCoder-AtCoderRegularContest113
└── AtCoder-AtCoderRegularContest114
```

### `port: number`

Specifies the **port** where [competitive companion extension](https://github.com/jmerle/competitive-companion) will send problem's data.
**1327** is the default port for `cpbooster` in competitive companion so, if you don't change
the port, it will just work as expected. If you must change it, then be sure that you also
change it in competitive companion extension settings.

### `editor: string`

Name of the **editor** that will be opened after running `cpb clone`.
The **editor** value should match with the terminal command you use to launch it. See [Editor Requirements](#editor-requirements)

#### Editor Requirements

1. You must be able to open your **editor** using a terminal command.
2. The **editor command** should support the following format to open a directory:

```shell
$ editor [directory]
```

If your editor does not support this format but has another way to open a directory, you could take a look at
"[How to add an editor](/docs/add-editor-support)"

#### Examples

- Using **regular editor** ( _VSCode_ ):

```json
{
  "editor": "code"
}
```

since `code` is the command that is used to execute _vscode_ from the terminal.

- Using **terminal emulator** ( _konsole_ ):

```json
{
  "editor": "konsole"
}
```

:::note
**Terminal Emulator** support is currently limited to this [List of supported terminals](#list-of-supported-terminals).
Visit the section "[How to add an editor](/docs/add-editor-support)" if you wish to contribute and add support
for other terminal emulators.
:::

#### List of supported terminals

- `"konsole"`
- `"xterm"`
- `"gnome-terminal"`
- `"deepin-terminal"`
- `"kitty"`
- `"terminal"` (MacOS)

### `closeAfterClone: boolean`

Whether to close the terminal where you executed `cpb clone` or not.

:::caution
When using this option as `true` verify that your [**editor**](#editor-string) satisfies the [Editor Requirements](#editor-requirements), otherwise,
you might end up with your terminal closed and no editor opened.
:::

### `showStatusPageOnSubmit: boolean`

Whether to open a browser window in the submission status page or not, after running `cpb submit`

### `preferredLang: string`

The extension name in lowercase of your preferred language. ( i.e. `"cpp"`, `"py"`, `"java"`, ... ),
`cpb clone` uses this value to create corresponding source files with the template of your
preferred language.

:::note
Currently the only supported languages are **C++** and **Python**, If you wish to contribute and add support
for other languages visit the section "[How to add a language](/docs/add-language-support)".
:::

### `languages.<lang>.template: string`

Path to your competitive programming template for the corresponding `<lang>`.

Examples of competitive programming templates:

- [CompetitiveProgrammingTemplate.cpp](https://gitlab.com/searleser97/competitive-programming-reference/-/blob/master/Reference/Coding%20Resources/C++/Competitive%20Programming%20Template.cpp)
- [CompetitiveProgrammingTemplate.py](https://gitlab.com/searleser97/competitive-programming-reference/-/blob/master/Reference/Coding%20Resources/Python/Competitive%20Programming%20Template.py)

### `languages.<lang>.command: string`

Command used to **compile** (C++, Java, ...) or **run** (Python, Ruby) your program.

For example: If you use codeforces it is convenient that you use the same command they use for each language

#### `cpp`

```json
{
  "languages": {
    "cpp": {
      "command": "g++ -std=gnu++17 -O2"
    },
    "py": {
      "command": "python3"
    }
  }
}
```
