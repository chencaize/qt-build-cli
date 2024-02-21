const fs = require("fs-extra");
const path = require('path');  
const { exec } = require("child_process");
const chalk = require("chalk");
const { LogUtils } = require("common-utils-core");
const lessCommandPath = path.join(path.dirname(require.resolve('less-4.2.0-4261')), './bin/lessc'); // 构造完整的命令路径  

async function less(source, destination, params) {
    //make sure source is exist
    let sourceStat;
    try {
        sourceStat = fs.statSync(source);
        if (!sourceStat.isFile()) {
            LogUtils.error(`${chalk.red(source)} is not a valid ${BUILD_STYLE_CMD} file!`);
            return;
        }
    } catch (error) {
        LogUtils.error(`${chalk.red(source)} is not a valid ${BUILD_STYLE_CMD} file!`);
        return;
    }
    let execCMD = `node ${lessCommandPath} ${source} ${destination} ${params}`;
    LogUtils.debug(`exec cmd:${chalk.green(execCMD)}`);
    const { stderr } = await exec(execCMD);
    const err = await promisfiyStderr(stderr);
    if (err) {
        LogUtils.error(`${chalk.red("less")} exec failed... ${err}`);
    } else {
        LogUtils.debug(`${chalk.green("less")} exec successed...`);
    }
}
async function promisfiyStderr(stderr) {
    return new Promise((reso) => {
        stderr.on("data", (err) => {
            reso(err);
        })
        stderr.on("close", (val) => {
            reso();
        })
    })
}

module.exports = less;