const fse = require("fs-extra");
const json5 = require("json5");
const chalk = require("chalk");
const handlebars = require("handlebars");
const { arrayToObjBySpearator } = require("./utils");
const { LogUtils } = require("common-utils-core");
const { CONFIG_MODE } = require("./globalVirs");

function globalOptions(option) {

    let newOption = { ...option }; //copy option

    handleDebug(newOption);

    LogUtils.setShowLog(newOption.debug);
    LogUtils.debug('original option:', option);

    handleSperator(newOption);

    handleReplace(newOption);

    handleConfig(newOption);

    handleParams(newOption);

    LogUtils.debug(`option:`, newOption);

    return newOption;
}

function handleDebug(option) {
    //do nothing
}

function handleSperator(option) {
    //do nothing
}

function handleReplace(option) {
    option.replace = option.replace ? arrayToObjBySpearator(option.replace, option.spearator) : {};
}

function handleConfig(option) {
    let config = option.config;
    let configMode = CONFIG_MODE.NULL;
    if (!config || !(config instanceof Array) || config.length <= 0) {
        LogUtils.error(`config is not right!`);
        option.config = {};
        option.configMode = configMode;
        return;
    }

    //使用replace对参数进行字符替换
    try {
        const template = handlebars.compile(JSON.stringify(config));
        config = JSON.parse(template(option.replace));
    } catch (error) {
        LogUtils.error(`replace config failed!${chalk.red(error)}!`);
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
            LogUtils.error(`${configPath} is not a valid json file.${err}`);
            option.config = {};
            option.configMode = configMode;
            return;
        }

        if (config.length > 1) {
            configMode = CONFIG_MODE.FILE_ACTIVATE;
            config = [jsonObj, ...config.slice(1)]
        } else {
            configMode = CONFIG_MODE.FILE;
            config = [jsonObj];
        }
    } else {
        configMode = CONFIG_MODE.ARGUMENT;
        config = [...config];
    }

    //使用replace对配置文件进行字符替换
    try {
        const template = handlebars.compile(JSON.stringify(config));
        config = JSON.parse(template(option.replace));
    } catch (error) {
        LogUtils.error(`replace config file failed!${chalk.red(error)}!`);
        option.config = config;
        option.configMode = configMode;
        return;
    }
    
    option.config = config;
    option.configMode = configMode;
}

function handleParams(option) {
    let params = option.params;
    if (!params) {
        option.params = [];
        return;
    }
    //使用replace对参数进行字符替换
    try {
        const template = handlebars.compile(JSON.stringify(params));
        params = JSON.parse(template(option.replace));
    } catch (error) {
        LogUtils.error(`replace params failed!${chalk.red(error)}!`);
    }
    //替换单双引号
    params = params && params.map(item => {
        return item.replace(/\'/g, "\"");
    })

    option.params = params;
}

module.exports = globalOptions;