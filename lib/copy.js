const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

async function copy(copyConfig, active) {
    //根据active获取数据并组装成移动对象数组
    let copys = [];
    try {
        let files = copyConfig["files"], dirs = copyConfig["dirs"];

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

    copys.forEach(item => {
        copyAToB(item["from"], item["to"]);
    })
}

function copyAToB(file, dir) {
    fs.ensureDirSync(dir);

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