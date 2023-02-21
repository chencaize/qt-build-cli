const fs = require("fs-extra");
const { exec } = require("child_process");
const chalk = require("chalk");

async function less(lessConfig) {

    //make sure less
    let cmd = "less";
    let result = await makeSureLessc(cmd);

    if (!result) {
        console.error(`${chalk.red(cmd)} is not exist!`)
        return;
    }

    //make sure from
    const { from, to } = lessConfig;
    let fileStat;
    try {
        fileStat = fs.statSync(from);
        if (!fileStat.isFile()) {
            console.error(`${chalk.red(from)} is not a valid less file!`);
            return;
        }
    } catch (error) {
        console.error(`${chalk.red(from)} is not a valid less file!`);
        return;
    }

    const { stderr } = await exec(`${cmd}c ${from} ${to}`);
    const err = await promisfiyStderr(stderr);
    if (err) {
        console.error(`${chalk.red(cmd)} exec failed...`);
    } else {
        console.log(`${chalk.green(cmd)} exec successd...`);
    }

}

async function makeSureLessc(cmd) {

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


module.exports = less;