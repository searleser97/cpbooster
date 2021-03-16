---
id: Configuration
title: Configuration
---

`cpbooster` by default searches/creates for a configuration file named `cpbooster-config.json` in your **$HOME** directory.

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
  "terminal": "konsole",
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

`default: "home/user/Contests"`

The path to the directory where contests folders will be created when you run `cpbooster clone`.

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

`default: 1327`

Specifies the **port** where [competitive companion extension](https://github.com/jmerle/competitive-companion) will send problem's data.
**1327** is the default port for `cpbooster` in competitive companion so, if you don't change
the port, it will just work as expected. If you must change it, then be sure that you also
change it in competitive companion extension settings.

### `editor: string`

`default: "konsole"`

Name of the "terminal" that you will be using
