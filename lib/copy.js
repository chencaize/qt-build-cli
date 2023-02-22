const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { CONFIG_MODE } = require("./globalVirs");
const { arrayToArrayBySperator } = require("./utils");

async function copy(options) {
    let copys = [];
    switch (options.configMode) {
        case CONFIG_MODE.FILE: {
            //根据active获取数据并组装成移动对象数组
            try {
                let copyConfig = options["config"][0]["copy"];
                let files = copyConfig["files"], dirs = copyConfig["dirs"];
                let active = arrayToArrayBySperator(options["config"].slice(1), options.spearator);

                active.forEach(item => {
                    const [from, to] = item || [];
                    const { prefix: fromPrefix = "", items: fromItems = [] } = files[from] || {};
                    const { prefix: toPrefix = "", items: toItems = [] } = dirs[to] || {};
                    toItems.forEach(toItem => {
                        let _toItem = path.join(toPrefix, toItem);
                        fromItems.forEach(fromItem => {
                            let _fromItem = path.join(fromPrefix, fromItem);
                            copys.push({
                                from: _fromItem,
                                to: _toItem
                            })
                        })
                    })

                })
            } catch (error) {
                console.error(`config file is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
        case CONFIG_MODE.PARAMETER: {
            let active = arrayToArrayBySperator(options["config"], options.spearator);
            copys = active.map(item => {
                const [from, to] = item || [];
                return {
                    from,
                    to,
                }
            })
        } break;
    }
    copys.forEach(item => {
        copyAToB(item["from"], item["to"]);
    })
}

function copyAToB(file, dir) {
    //make sure dir
    fs.ensureDirSync(dir);

    //make sure file is exist
    let fileStats;
    try {
        fileStats = fs.statSync(file);
        if (!fileStats.isFile()) {
            console.warn(`${chalk.yellow(file)} is not a right file!`);
            return;
        }
    } catch (error) {
        console.warn(`${chalk.yellow(file)} is not a right file!`);
        return;
    }

    fs.copyFileSync(file, path.join(dir, path.basename(file)));
}

module.exports = copy;