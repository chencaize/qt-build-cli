const fse = require("fs-extra");
const json5 = require("json5");
const chalk = require("chalk");
const handlebars = require("handlebars");
const { arrayToObjBySpearator } = require("./utils");
const { CONFIG_MODE } = require("./globalVirs");

function globalOptions(option) {
    let spearator = handleSperator(option.spearator);
    let replace = handleReplace(option.replace, spearator);
    let config = handleConfig(option.config, replace);
    let params = handleParams(option.params);
    return {
        ...config,
        spearator,
        replace,
        params,
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

    let isFile = false;
    if (config[0].includes(".")) { //may be a file
        let configPath = config[0];

        if (fse.existsSync(configPath)) {
            isFile = true;
        }
    }

    if (isFile) {
        let configPath = config[0];

        //读取json配置文件
        let jsonObj;

        try {
            jsonObj = fse.readFileSync(configPath);
            jsonObj = json5.parse(jsonObj.toString("utf-8"));
        } catch (err) {
            console.error(`${configPath} is not a valid json file.${err}`);
            return;
        }

        if (config.length > 1) {
            result["configMode"] = CONFIG_MODE.FILE_ACTIVATE;
            result["config"] = [jsonObj, ...config.slice(1)]
        } else {
            result["configMode"] = CONFIG_MODE.FILE;
            result["config"] = [jsonObj];
        }
    } else {
        result["configMode"] = CONFIG_MODE.ARGUMENT;
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

function handleParams(params) {
    params = params && params.map(item => {
        return item.replace(/\'/g, "\"");
    })
    return params;
}

module.exports = globalOptions;