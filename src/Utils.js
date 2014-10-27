var Utils = {};

/**
 * Takes two js-objects and merges merge into base, merge overrides common
 * keys with base
 *
 * @param base
 * @param merge
 * @returns {{}}
 * @private
 */
Utils.merge = function (base, merge) {
    var merged = {};

    for (var baseKey in base) {
        merged[baseKey] = base[baseKey];
    }

    for (var mergeKey in merge) {
        merged[mergeKey] = merge[mergeKey];
    }

    return merged;
};


/**
 * Function for checking browser support for window perfomance timing API
 * @returns {boolean}
 */
Utils.supportsNavigationTiming = function () {
    return !!(window.performance && window.performance.timing);
};

Utils.getOrdinal = function (number) {
    var numStr = number.toString();
    var last = numStr.slice(-1);
    var ord = '';
    switch (last) {
        case '1':
            ord = numStr.slice(-2) === '11' ? 'th' : 'st';
            break;
        case '2':
            ord = numStr.slice(-2) === '12' ? 'th' : 'nd';
            break;
        case '3':
            ord = numStr.slice(-2) === '13' ? 'th' : 'rd';
            break;
        default:
            ord = 'th';
            break;
    }
    return number + ord;
};

module.exports = Utils;