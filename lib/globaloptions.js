const fs = require("fs-extra");
const chalk = require("chalk");
const handlebars = require("handlebars");
const { arrayToObjBySpearator } = require("./utils");

function globalOptions(option) {

    let spearator = handleSperator(option.spearator);
    let replace = handleReplace(option.replace, spearator);
    let config = handleConfigPath(option.configpath, replace);

    return {
        config,
        spearator,
        replace,
    }
}

function handleConfigPath(configPath, replace) {
    let result = {};

    //校验config
    if (!fs.existsSync(configPath)) {
        console.error(`${chalk.red(configPath)} is not a valid config file!`);
        return {};
    }

    //读取json配置文件
    result = fs.readJSONSync(configPath);

    //使用replace对配置文件进行字符替换
    try {
        const template = handlebars.compile(JSON.stringify(result));
        result = JSON.parse(template(replace));
    } catch (error) {
        console.error(`config file is not right!${chalk.red(error)}!`);
        return {};
    }

    return result;
}

function handleSperator(spearator) {
    return spearator;
}

function handleReplace(replace, spearator) {
    return arrayToObjBySpearator(replace, spearator);
}

module.exports = globalOptions;