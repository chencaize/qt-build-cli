const fse = require("fs-extra");
const path = require("path");
const { LogUtils } = require("common-utils-core");

function arrayToObjBySpearator(array, spearator) {
    let _obj = {};
    if (!array || !(array instanceof Array)) {
        return _obj;
    }

    array.forEach(item => {
        const [key, value] = item.split(spearator);
        _obj[key] = value;
    })

    return _obj;
}

function arrayToArrayBySperator(array, spearator) {
    let _array = [];
    if (!array || !(array instanceof Array)) {
        return _array;
    }

    array.forEach(item => {
        _array.push(item.split(spearator));
    })

    return _array;
}

function copyDir(srcDir, tarDir) {
    if (!fse.existsSync(srcDir)) {
        return;
    }
    if (!fse.existsSync(tarDir)) {
        fse.ensureDirSync(tarDir);
    }
    fse.readdirSync(srcDir).forEach((file) => {
        const srcPath = path.join(srcDir, file);
        const dstPath = path.join(tarDir, file);
        const stat = fse.statSync(srcPath);

        if (stat.isDirectory()) {
            copyDir(srcPath, dstPath);
        } else {
            copyFile(srcPath, dstPath);
        }
    });
}

function copyFile(srcFile, tarFile) {
    if (!fse.existsSync(srcFile)) {
        return;
    }
    if (!fse.existsSync(tarFile)) {
        fse.ensureFileSync(tarFile);
    }
    fse.copyFile(srcFile, tarFile, (err) => {
        if (err) {
            LogUtils.error(`${srcFile} copy to ${tarFile} failed,error:${err}!`);
        }
    });
}

module.exports = {
    arrayToObjBySpearator,
    arrayToArrayBySperator,
    copyFile,
    copyDir,
}