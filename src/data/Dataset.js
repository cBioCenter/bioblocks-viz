"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dataset = /** @class */ (function () {
    function Dataset(name, namespace) {
        if (namespace === void 0) { namespace = 'bioblocks'; }
        this.name = name;
        this.namespace = namespace;
    }
    Object.defineProperty(Dataset.prototype, "fullName", {
        get: function () {
            return this.namespace + "/" + this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Dataset;
}());
exports.Dataset = Dataset;
//# sourceMappingURL=Dataset.js.map