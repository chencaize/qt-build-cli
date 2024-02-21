let CONFIG_MODE = {
    NULL:"",
    FILE: "FILE",//文件配置模式,全节点生效
    FILE_ACTIVATE: "FILE_ACTIVATE",//文件配置模式,可指定生效节点
    ARGUMENT: "ARGUMENT",//参数模式
}

let COPY_MATCH_MODE = {
    ALL_DIR: "all_dir",
    ALL_FILE: "all_file",
    REGEXP: "regexp",
}

module.exports = {
    CONFIG_MODE,
    COPY_MATCH_MODE,
}