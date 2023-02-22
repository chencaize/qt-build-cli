const fs = require("fs-extra");
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
            try {
                let buildStyleConfig = options["config"][0]["buildStyle"];
                let active = arrayToArrayBySperator(options["config"].slice(1), options.spearator);
                active.forEach(key => {
                    let item = buildStyleConfig[key];
                    builds.push({
                        from: item["from"],
                        to: item["to"],
                    })
                })
            } catch (error) {
                console.error(`config file is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
        case CONFIG_MODE.PARAMETER: {
            let active = arrayToArrayBySperator(options["config"], options.spearator);
            builds = active.map(item => {
                const [from, to] = item || [];
                return {
                    from,
                    to,
                }
            })
        } break;
    }
    builds.forEach(item => {
        buildStyleExec(BUILD_STYLE_CMD, item["from"], item["to"]);
    })
}

async function buildStyleExec(cmd, source, destination) {
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

    const { stderr } = await exec(`${cmd}c ${source} ${destination}`);
    const err = await promisfiyStderr(stderr);
    if (err) {
        console.error(`${chalk.red(cmd)} exec failed...`);
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