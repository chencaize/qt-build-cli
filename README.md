# qt-build-cli

exec command during build qt , presently it support buildStyle(less)、copy.

buildStyle:it can use less to compile the less file to qss file
copy:it can copy the file to target dir

# API

```
Usage: qt-build-cli [options] [command]

Options:
  -c, --config <items...>   config
  -r, --replace <items...>  replace item1 by item2
  -s, --spearator <char>    separator character (default: "-")
  -p, --params <items...>   params
  -v, --version             output the version number
  -h, --help                display help for command

Commands:
  copy                      copy files
  buildStyle                complier style(currently support less) files to qss
  help [command]            display help for command
```

# Installation

```
npm install qt-build-cli
#or
yarn add qt-build-cli
```

# Example

config.config

```json
{
    "copy": {
        "files": {
            "dll": {
                "prefix": "{{OUT_PWD}}/{{BUILD_TYPE}}",
                "items": [
                    "{{APP_NAME}}.dll"
                ]
            },
            "lib": {
                "prefix": "{{OUT_PWD}}/{{BUILD_TYPE}}",
                "items": [
                    "{{APP_NAME}}.lib"
                ]
            },
            "include": {
                "prefix": "{{PWD}}",
                "items": [
                    "demo.h"
                ]
            }
        },
        "dirs": {
            "debugdll": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}",
                    "{{DEBUG_DIR}}/{{APP_NAME}}"
                ]
            },
            "debuglib": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}/lib",
                    "{{DEBUG_DIR}}/{{APP_NAME}}/lib"
                ]
            },
            "debuginclude": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}/include",
                    "{{DEBUG_DIR}}/{{APP_NAME}}/include"
                ]
            },
            "releasedll": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}",
                    "{{PUBLISH_DIR}}/{{APP_NAME}}"
                ]
            },
            "releaselib": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}/lib",
                    "{{PUBLISH_DIR}}/{{APP_NAME}}/lib"
                ]
            },
            "releaseinclude": {
                "prefix": "",
                "items": [
                    "{{EXEC_DIR}}/include",
                    "{{PUBLISH_DIR}}/{{APP_NAME}}/include"
                ]
            }
        }
    },
    "buildStyle": {
        "demoa":{
            "from": "{{PWD}}/style.less",
            "to": "{{PWD}}/style.qss"
        }
    }
}
```

*.pro

```
#before build ,usually compiler less files to qss file 
system(qt-build-cli buildStyle -c config.config demoa -r PWD-$$PWD) 

#after build, usually copy the complier files and the header files to exec dir

#debug
QMAKE_POST_LINK += qt-build-cli -c config.config dll-debugdll lib-debuglib include-debuginclude -r PWD-$$PWD OUT_PWD-$$PWD/build APP_NAME-$$TARGET BUILD_TYPE-build EXEC_DIR-$$PWD/build/bin DEBUG_DIR-$$PWD/build/debug

#release
QMAKE_POST_LINK += qt-build-cli -c config.config dll-releasedll lib-releaselib include-releaseinclude -r PWD-$$PWD OUT_PWD-$$PWD/build APP_NAME-$$TARGET BUILD_TYPE-build EXEC_DIR-$$PWD/build/bin PUBLISH_DIR-$$PWD/build/publish
```




# How to use it

## copy

### command

```
qt-build-cli copy -c "demo1.js-dir1" "{{APP}}.js-dir2" -r APP-demo3
```

it will copy demo1.js to dir1 , then copy demo3.js to dir2

### config file

```json
{
    "copy":{
        "files":{
            "demo1":{
                "prefix": "d:/",
                "items": [
                    "demo1.js"
                ]
            },
            "demo3":{
                "prefix": "d:/",
                "items": [
                    "{{APP}}.js"
                ]
            }
        },
        "dirs":{
            "demo2":{
                "prefix": "d:/",
                "items": [
                    "dir1"
                ]
            },
            "demo4":{
                "prefix": "d:/",
                "items": [
                    "dir2"
                ]
            }
        }
    }
}
```

```
qt-build-cli copy -c config.config demo1-demo2 demo3-demo4 -r APP-demo3
```

it will copy d:\demo1.js to d:\dir1 , then copy d:\demo3.js to d:\dir2

## buildStyle

### command 

```
qt-build-cli buildStyle -c "demo1.less-demo2.qss" "{{APP}}.less-demo4.qss" -p "--js" "--js" -r APP-demo3
```

it will exec lessc demo1.less demo2.qss, and then exec lessc demo3.less demo4.qss.

### config files

config.config

```json
{
    "buildStyle":{
        "demo":{
            "from":"demo1.less",
            "to":"demo2.qss",
        },
        "demo2":{
            "from":"{{APP}}.less",
            "to":"demo4.qss",
        }
    }
}
```

```
qt-build-cli buildStyle -c config.config demo demo2 -p "--js" "--js" -r APP-demo3
```

it will exec lessc demo1.less demo2.qss, and then exec lessc demo3.less demo4.qss.

# update
1. 1.0.9 fix README.md