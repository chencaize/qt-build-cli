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

module.exports = {
    arrayToObjBySpearator,
    arrayToArrayBySperator,
}