# qt-build-cli

exec command during build qt , presently it support less、copy.

# Example

config.json

```json
{
    "copy": {
        "files": {
            "fileDemoA": {
                "prefix": "{{OUT_PWD}}",
                "items": [
                    "{{APP_NAME}}.dll"
                ]
            },
        },
        "dirs": {
            "dirDemoA": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}",
                    "{{APP_NAME}}"
                ]
            },
        }
    },
    "less": {
        "from": "{{PWD}}/style.less",
        "to": "{{PWD}}/style.qss"
    }
}
```

*.pro

```
#before build ,usually compiler less files to qss file 
system(qt-build-cli less -c config.json -r PWD-$$PWD OUT_PWD-$$PWD/build EXEC_DIR-$$PWD/build/bin APP_NAME-demo ) 

#after build, usually copy the complier files and the header files to exec dir
QMAKE_POST_LINK += qt-build-cli -c config.json -r PWD-$$PWD OUT_PWD-$$PWD/build EXEC_DIR-$$PWD/build/bin APP_NAME-demo -a fileDemoA-dirDemoA
```

# Installation

```
npm install qt-build-cli
#or
yarn add qt-build-cli
```

# API

```
Usage: qt-build-cli [options] [command]

Options:
  -c, --configpath <path>   path of config file (default: "qtbuildcli.config")
  -r, --replace <items...>  replace item1 by item2 (-r item1-item2)
  -s, --spearator <char>    separator character (default: "-")
  -v, --version             output the version number
  -h, --help                display help for command

Commands:
  copy [options]            copy files
  less                      complier less files to qss
  help [command]            display help for command
```

# How to use it

# update
