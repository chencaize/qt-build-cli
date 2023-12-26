# qt-build-cli

exec command during build qt , presently it support buildStyle(less)、copy.

buildStyle:it can use less to compile the less file to qss file
copy:it can copy the file

# API

```
Usage: qt-build-cli [options] [command]

Options:
  -c, --config <items...>   config
  -r, --replace <items...>  replace item1 by item2
  -s, --spearator <char>    separator character (default: "-")
  -p, --params <items...>   params(use '' to quote)
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

## copy

### CONFIG FILE
``` json
//config.json
{
    "copy": {
        "demo1": {
            "from": {
                "prefix": "example/copy/source",
                "items": [
                    "**", //this means all directory
                    "*.*" //this means all files
                ]
            },
            "to": {
                "prefix": "example/copy/target",
                "items": [
                    "demo1"
                ]
            }
        },
        "demo2": {
            "from": {
                "prefix": "example/copy/source",
                "items": [
                    "1.*",//which like 1.txt,1.pdf,1.cpp and so on 
                    "*.pdf",//which like a.pdf,b.pdf and so on
                    "test*", //which start with test
                    "dir*", //which start with dir
                    "*test",// which end with test
                    "r[d.dll$]" //use regexp
                ]
            },
            "to": {
                "prefix": "example/copy/target",
                "items": [
                    "demo2_1",
                    "demo2_2"
                ]
            }
        },
        "demo3": {
            "from": {
                "prefix": "example/copy/source",
                "items": [
                    "{{VIRABLE}}.*"//use -r to override the VIRABLE,eg: -r VIRABLE-test1
                ]
            },
            "to": {
                "prefix": "example/copy/target",
                "items": [
                    "demo3"
                ]
            }
        }
    },
}
```

1. 
```
qt-build-cli copy -c example/config.json -r VIRABLE-test1
```

it will activate demo1,demo2 and demo3

2. 
```
qt-build-cli copy -c example/config.json demo1
```

it will activate demo1

### COMMAND

1. 
```
qt-build-cli copy -c 'example/copy/source/1.cpp-example/copy/target'
```
 
it will copy the 1.cpp file to target

2. 
```
qt-build-cli copy -c 'example/copy/source/1.cpp-example/copy/target/1.cpp'
```
 
it will copy the 1.cpp file to target

3. 
```
qt-build-cli copy -c 'example/copy/source/1.cpp-example/copy/target/1copy.cpp'
```

it will copy the 1.cpp file to target and rename to 1copy.cpp

4. 
```
qt-build-cli copy -c 'example/copy/source/1.*-example/copy/target'
```

it will copy the files startwith 1. (eg:1.txt,1.cpp and so on) to target

5. 
```
qt-build-cli copy -c 'example/copy/source/{{VIRABLE}}.*-example/copy/target' -r VIRABLE-1
```

it will replace the VIRABLE by 1,and copy the 1.* files to target


#### Careful
you can not copy files to a file,this may cause something unpredictable.

## buildStyle

### CONFIG FILE

``` json
//config.json
{
     "buildStyle": {
        "demo1": {
            "from": {
                "prefix": "example/buildstyle/source",
                "item": "a.less"
            },
            "to": {
                "prefix": "example/buildstyle/target",
                "item": "a.qss"
            }
        },
        "demo2": {
            "from": {
                "prefix": "example/buildstyle/source",
                "item": "{{VIRABLE}}.less"
            },
            "to": {
                "prefix": "example/buildstyle/target",
                "item": "{{VIRABLE}}.qss"
            }
        }
    }
}
```

1. 
```
qt-build-cli buildStyle -c example/config.json -r VIRABLE-app
```

it will activate demo1,demo2,replace the VIRABLE by app and build a.less to a.qss,app.less to app.qss

2. 
```
qt-build-cli buildStyle -c example/config.json demo1
```

it will activate demo1 and build a.less to a.qss

### COMMAND

1. 
```
qt-build-cli buildStyle -c 'example/buildstyle/source/a.less-example/buildstyle/target/a.qss'
```

it will use lessc to build a.less to a.qss

2. 
```
qt-build-cli buildStyle -c 'example/buildstyle/source/{{VIRABLE}}.less-example/buildstyle/target/{{VIRABLE}}.qss' -r VIRABLE-app
```

it will replace the VIRABLE by app and then use lessc to build app.less to app.qss

3. 
```
qt-build-cli buildStyle -c 'example/buildstyle/source/a.less-example/buildstyle/target/a.qss' -p '--js'
```

it will use lessc to build a.less to a.qss with param --js, the cmd will like follow

```
lessc example/buildstyle/source/a.less example/buildstyle/target/a.qss --js
```

4. 
```
qt-build-cli buildStyle -c 'example/buildstyle/source/a.less-example/buildstyle/target/a.qss' 'example/buildstyle/source/{{VIRABLE}}.less-example/buildstyle/target/{{VIRABLE}}.qss' -r VIRABLE-app -p '\ --js' '\ --modify-var=theme=yellow'
```

it will use lessc to build ,the cmd will like follow(if you want to add params to less,you should add "\ " to avoid it mistakenly as options)

```
lessc example/buildstyle/source/a.less example/buildstyle/target/a.qss \ --js
lessc example/buildstyle/source/app.less example/buildstyle/target/app.qss \ --modify-var=theme=yellow
```

# update
1. 1.0.9 fix README.md
2. 1.1.0 upgrade to support more copy feature,add example,modify README.md