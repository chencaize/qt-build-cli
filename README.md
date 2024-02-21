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
  -d, --debug               turn on debugging:display logs (default: false)    
  -v, --version             output the version number
  -h, --help                display help for command

Commands:
  copy                      copy files
  buildStyle [options]      complier style(currently support less) files to qss
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
                "prefix": "test/source/copy",
                "items": [
                    "**", //this means all directory
                    "*.*" //this means all files
                ]
            },
            "to": {
                "prefix": "test/target/copy",
                "items": [
                    "demo1"
                ]
            }
        },
        "demo2": {
            "from": {
                "prefix": "test/source/copy",
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
                "prefix": "test/target/copy",
                "items": [
                    "demo2_1",
                    "demo2_2"
                ]
            }
        },
        "demo3": {
            "from": {
                "prefix": "test/source/copy",
                "items": [
                    "{{VIRABLE}}.*"//use -r to override the VIRABLE,eg: -r VIRABLE-test1
                ]
            },
            "to": {
                "prefix": "test/target/copy",
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
qt-build-cli copy -c test/config.json -r VIRABLE-test1
```

it will activate demo1,demo2 and demo3

2. 
```
qt-build-cli copy -c test/config.json demo1
```

it will activate demo1

### COMMAND

1. 
```
qt-build-cli copy -c 'test/source/copy/1.cpp-test/target/copy'
```
 
it will copy the 1.cpp file to target

2. 
```
qt-build-cli copy -c 'test/source/copy/1.cpp-test/target/copy/1.cpp'
```
 
it will copy the 1.cpp file to target

3. 
```
qt-build-cli copy -c 'test/source/copy/1.cpp-test/target/copy/1copy.cpp'
```

it will copy the 1.cpp file to target and rename to 1copy.cpp

4. 
```
qt-build-cli copy -c 'test/source/copy/1.*-test/target/copy'
```

it will copy the files startwith 1. (eg:1.txt,1.cpp and so on) to target

5. 
```
qt-build-cli copy -c 'test/source/copy/{{VIRABLE}}.*-test/target/copy' -r VIRABLE-1
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
                "prefix": "test/source/buildstyle",
                "item": "a.less"
            },
            "to": {
                "prefix": "test/target/buildstyle",
                "item": "a.qss"
            }
        },
        "demo2": {
            "from": {
                "prefix": "test/source/buildstyle",
                "item": "{{VIRABLE}}.less"
            },
            "to": {
                "prefix": "test/target/buildstyle",
                "item": "{{VIRABLE}}.qss"
            }
        }
    }
}
```

1. 
```
qt-build-cli buildStyle -c test/config.json -r VIRABLE-app
```

it will activate demo1,demo2,replace the VIRABLE by app and build a.less to a.qss,app.less to app.qss

2. 
```
qt-build-cli buildStyle -c test/config.json demo1
```

it will activate demo1 and build a.less to a.qss

### COMMAND

1. 
```
qt-build-cli buildStyle -c 'test/source/buildstyle/a.less-test/target/buildstyle/a.qss'
```

it will use lessc to build a.less to a.qss

2. 
```
qt-build-cli buildStyle -c 'test/source/buildstyle/{{VIRABLE}}.less-test/target/buildstyle/{{VIRABLE}}.qss' -r VIRABLE-app
```

it will replace the VIRABLE by app and then use lessc to build app.less to app.qss

3. 
```
qt-build-cli buildStyle -c 'test/source/buildstyle/a.less-test/target/buildstyle/a.qss' -p '--js'
```

it will use lessc to build a.less to a.qss with param --js, the cmd will like follow

```
lessc test/source/buildstyle/a.less test/target/buildstyle/a.qss --js
```

4. 
```
qt-build-cli buildStyle -c 'test/source/buildstyle/a.less-test/target/buildstyle/a.qss' 'test/source/buildstyle/{{VIRABLE}}.less-test/target/buildstyle/{{VIRABLE}}.qss' -r VIRABLE-app -p '\ --js' '\ --modify-var=theme=yellow'
```

it will use lessc to build ,the cmd will like follow(if you want to add params to less,you should add "\ " to avoid it mistakenly as options)

```
lessc test/source/buildstyle/a.less test/target/buildstyle/a.qss \ --js
lessc test/source/buildstyle/app.less test/target/buildstyle/app.qss \ --modify-var=theme=yellow
```

# update
1. 1.0.9 fix README.md
2. 1.1.0 upgrade to support more copy feature,add test,modify README.md
3. 1.1.1 config json file support comment
4. 1.1.2 Fix the issue that items in the copy cannot use multi-level directories
5. 1.1.3 Fix config param's repalce bug,add debug option
6. 1.1.4 Fix qtBuildCli can not get the params' bug
7. 1.1.5 rename example to test,add test script,use less 4.2.0
8. 1.1.6 modify less to less-4.2.0-4261,this is less's PR 4261(this will support variable concatenation)
9. 1.1.7 Fix lessc command not found bug