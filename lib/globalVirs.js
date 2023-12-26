let CONFIG_MODE = {
    FILE: "FILE",//文件配置模式,全节点生效
    FILE_ACTIVATE: "FILE_ACTIVATE",//文件配置模式,可指定生效节点
    ARGUMENT: "ARGUMENT",//参数模式
}

let COPY_MATCH_MODE = {
    ALL_DIR: "all_dir",
    ALL_FILE: "all_file",
    REGEXP: "regexp",
}

let BUILD_STYLE_CMD = "less"

module.exports = {
    CONFIG_MODE,
    COPY_MATCH_MODE,
    BUILD_STYLE_CMD,
}