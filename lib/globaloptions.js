const fs = require("fs-extra");
const chalk = require("chalk");
const handlebars = require("handlebars");
const { arrayToObjBySpearator } = require("./utils");
const { CONFIG_MODE } = require("./globalVirs");

function globalOptions(option) {
    let spearator = handleSperator(option.spearator);
    let replace = handleReplace(option.replace, spearator);
    let config = handleConfig(option.config, replace);

    return {
        ...config,
        spearator,
        replace,
    }
}

function handleSperator(spearator) {
    return spearator;
}

function handleReplace(replace, spearator) {
    return arrayToObjBySpearator(replace, spearator);
}

function handleConfig(config, replace) {
    let result = {};
    if (!config || !(config instanceof Array) || config.length <= 0) {
        console.error(`config is not right!`);
        return result;
    }

    if (config[0].endsWith(".config")) {
        let configPath = config[0];

        //校验config
        if (!fs.existsSync(configPath)) {
            console.error(`${chalk.red(configPath)} is not a valid config file!`);
            return result;
        }

        //读取json配置文件
        let jsonObj = fs.readJSONSync(configPath);

        result["configMode"] = CONFIG_MODE.FILE;
        result["config"] = [jsonObj, ...config.slice(1)];
    } else {
        result["configMode"] = CONFIG_MODE.PARAMETER;
        result["config"] = [...config];
    }

    //使用replace对配置文件进行字符替换
    try {
        const template = handlebars.compile(JSON.stringify(result["config"]));
        result["config"] = JSON.parse(template(replace));
    } catch (error) {
        console.error(`config file is not right!${chalk.red(error)}!`);
        return result;
    }

    return result;
}

module.exports = globalOptions;