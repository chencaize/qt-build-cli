const path = require("path");
const chalk = require("chalk");
const { arrayToArrayBySperator } = require("./utils");
const {less} = require("./less");
const { CONFIG_MODE } = require("./globalVirs");
const { LogUtils } = require("common-utils-core");

async function buildStyle(options) {
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
                LogUtils.error(`config file is not right!${chalk.red(error)}!`);
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
                LogUtils.error(`argument is not right!${chalk.red(error)}!`);
                return;
            }
        } break;
    }
    builds.forEach(item => {
        less(BUILD_STYLE_CMD, item["from"], item["to"], item["params"]);
    })
}

module.exports = buildStyle;