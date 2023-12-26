const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const chalk = require("chalk");
const { arrayToArrayBySperator } = require("./utils");
const { BUILD_STYLE_CMD, CONFIG_MODE } = require("./globalVirs");

async function buildStyle(options) {
    //make sure cmd
    let result = await makeSureCmd(BUILD_STYLE_CMD);

    if (!result) {
        console.error(`${chalk.red(BUILD_STYLE_CMD)} is not exist!`)
        return;
    }
    let builds = [];
    switch (options.configMode) {
        case CONFIG_MODE.FILE: {
            options["config"] = [...options["config"], ...Object.keys(options["config"][0]["buildStyle"])];
        }
        case CONFIG_MODE.FILE_ACTIVATE: {
            try {
                let buildStyleConfig = options["config"][0]["buildStyle"];
                let actives = options["config"].slice(1);
                let params = options["params"] || [];

                for (let i = 0; i < actives.length; ++i) {
                    let active = actives[i];

                    const { from, to } = buildStyleConfig[active];

                    const { prefix: fromPrefix, item: fromItem } = from;
                    const { prefix: toPrefix, item: toItem } = to;

                    builds.push({
                        from: path.join(fromPrefix, fromItem),
                        to: path.join(toPrefix, toItem),
                        params: params[i] || "",
                    })
                }
            } catch (error) {
                console.error(`config file is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
        case CONFIG_MODE.ARGUMENT: {
            try {
                let active = arrayToArrayBySperator(options["config"], options.spearator);
                let params = options["params"] || [];
                builds = active.map((item, index) => {
                    const [from, to] = item || [];
                    return {
                        from,
                        to,
                        params: params[index] || "",
                    }  
                })
            } catch (error) {
                console.error(`argument is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
    }
    builds.forEach(item => {
        buildStyleExec(BUILD_STYLE_CMD, item["from"], item["to"], item["params"]);
    })
}

async function buildStyleExec(cmd, source, destination, params) {
    //make sure source is exist
    let sourceStat;
    try {
        sourceStat = fs.statSync(source);
        if (!sourceStat.isFile()) {
            console.error(`${chalk.red(source)} is not a valid ${BUILD_STYLE_CMD} file!`);
            return;
        }
    } catch (error) {
        console.error(`${chalk.red(source)} is not a valid ${BUILD_STYLE_CMD} file!`);
        return;
    }
    let execCMD = `${cmd}c ${source} ${destination} ${params}`;
    console.log(`exec cmd:${chalk.green(execCMD)}`);
    const { stderr } = await exec(execCMD);
    const err = await promisfiyStderr(stderr);
    if (err) {
        console.error(`${chalk.red(cmd)} exec failed... ${err}`);
    } else {
        console.log(`${chalk.green(cmd)} exec successed...`);
    }
}


async function makeSureCmd(cmd) {

    const { stderr } = await exec(`${cmd}c -v`)

    const err1 = await promisfiyStderr(stderr);

    if (err1) {
        console.warn(`${chalk.yellow(cmd)} is not exist! Try to install it!`);

        const { stderr } = await exec(`npm install ${cmd} -g`);

        const err2 = await promisfiyStderr(stderr);

        if (err2) {
            console.error(`install ${cmd} failed...${chalk.red(err2)}`)
            return false;
        }
        console.log(`install ${chalk.green(cmd)} success.`);
        return true;
    }

    return true;
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


module.exports = buildStyle;