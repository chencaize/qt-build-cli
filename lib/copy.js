const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { CONFIG_MODE, COPY_MATCH_MODE } = require("./globalVirs");
const { arrayToArrayBySperator, copyDir, copyFile, isDir } = require("./utils");
const { LogUtils } = require("common-utils-core");

async function copy(options) {
    let copys = [];
    switch (options.configMode) {
        case CONFIG_MODE.FILE: {
            options["config"] = [...options["config"], ...Object.keys(options["config"][0]["copy"])];
        }
        case CONFIG_MODE.FILE_ACTIVATE: {
            try {
                let copyConfig = options["config"][0]["copy"];
                let actives = options["config"].slice(1);
                for (let i = 0; i < actives.length; ++i) {
                    let active = actives[i];
                    const { from, to } = copyConfig[active];

                    const { prefix: fromPrefix, items: fromItems } = from;
                    const { prefix: toPrefix, items: toItems } = to;

                    //get all paths and generate configuration information
                    let sourceDirMap = {};
                    fromItems.forEach(fromItem => {
                        let _dir = path.dirname(path.join(fromPrefix, fromItem));
                        let _basename = path.basename(path.join(fromPrefix, fromItem));
                        if (!sourceDirMap[_dir]) {
                            sourceDirMap[_dir] = {
                                sourceDir: _dir,
                                froms: [],
                                targets: toItems.map(item => [true, path.join(toPrefix, item)])
                            };
                        }
                        sourceDirMap[_dir].froms.push(_basename);
                    })
                    Object.keys(sourceDirMap).forEach(key => {
                        let item = sourceDirMap[key];
                        copys.push({
                            sourceDir: item.sourceDir,
                            froms: item.froms.map(item => handleFrom(item)),
                            targets: item.targets
                        })
                    })
                }
            } catch (error) {
                LogUtils.error(`config file is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
        case CONFIG_MODE.ARGUMENT: {
            try {
                let active = arrayToArrayBySperator(options["config"], options.spearator);
                copys = active.map(item => {
                    const [from, to] = item || [];
                    return {
                        sourceDir: path.dirname(from),
                        froms: [handleFrom(path.basename(from))],
                        targets: [[!to.includes("."), to]]
                    }
                })
            } catch (error) {
                LogUtils.error(`argument is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
    }
    copys.forEach(item => {
        handleCopy(item);
    })
}

function handleFrom(val) {
    let result = {
        type: "",
        value: "",
    };
    //handle regexp
    if (val.startsWith("r[") && val.endsWith("]")) {
        result.type = COPY_MATCH_MODE.REGEXP;
        result.value = new RegExp(val.slice(2, -1));
    } else if (val === "**") {
        result.type = COPY_MATCH_MODE.ALL_DIR;
        result.value = "";
    } else if (val === "*.*") {
        result.type = COPY_MATCH_MODE.ALL_FILE;
        result.value = "";
    } else {
        result.type = COPY_MATCH_MODE.REGEXP;
        let newVal = val;
        newVal = newVal.replaceAll(".", "\\.");
        newVal = newVal.replaceAll("*", ".*");
        result.value = new RegExp(`^${newVal}$`);
    }
    return result;
}

function handleCopy(val) {
    const { sourceDir, froms, targets } = val;

    //check source dir
    let sourceDirStat;
    try {
        sourceDirStat = fs.statSync(sourceDir);
    } catch (error) {
    }

    if (!sourceDirStat || !sourceDirStat.isDirectory()) {
        LogUtils.error(`${sourceDir} is not a dir!`);
        return;
    }

    //loop all the files and check it 
    const list = fs.readdirSync(sourceDir);
    for (let j = 0; j < list.length; j++) {
        const _name = list[j];
        const _path = path.join(sourceDir, _name);
        let _stat;
        try {
            _stat = fs.statSync(_path);
        } catch (error) {

        }
        const isDir = _stat.isDirectory();

        let isMatch = false;

        //check the file weather it is pass the rules or not
        for (let i = 0; i < froms.length; ++i) {
            const { type, value } = froms[i];

            if (type === COPY_MATCH_MODE.ALL_DIR) {
                if (isDir) {
                    isMatch = true;
                    break;
                }
            } else if (type === COPY_MATCH_MODE.ALL_FILE) {
                if (!isDir) {
                    isMatch = true;
                    break;
                }
            } else {
                if (value.test(_name)) {
                    isMatch = true;
                    break;
                }
            }
        }

        if (isMatch) {
            if (isDir) {
                targets.forEach(item => {
                    const [isDir, value] = item;
                    if (isDir) {
                        LogUtils.debug(`copy dir ${chalk.green(_path)} to dir ${chalk.green(path.join(value, _name))}`);
                        copyDir(_path, path.join(value, _name));
                    } else {
                        LogUtils.warn(`cannot copy dir ${chalk.red(_path)} to file ${chalk.red(value)}`);
                    }
                })
            } else {
                targets.forEach(item => {
                    const [isDir, value] = item;
                    if (isDir) {
                        LogUtils.debug(`copy file ${chalk.green(_path)} to dir ${chalk.green(value)}`);
                        copyFile(_path, path.join(value, _name));
                    } else {
                        LogUtils.debug(`copy file ${chalk.green(_path)} to file ${chalk.green(value)}`);
                        copyFile(_path, value);
                    }
                })
            }
        }

    }
}

module.exports = copy;