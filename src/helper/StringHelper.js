"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = function (text) {
    return "" + text.substr(0, 1).toLocaleUpperCase() + text.substr(1).toLocaleLowerCase();
};
exports.capitalizeEveryWord = function (text) {
    return text
        .split(' ')
        .map(function (word) { return "" + word.substr(0, 1).toLocaleUpperCase() + word.substr(1).toLocaleLowerCase(); })
        .join(' ');
};
//# sourceMappingURL=StringHelper.js.map