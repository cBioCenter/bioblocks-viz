"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immutable_1 = require("immutable");
var React = require("react");
var util_1 = require("util");
var data_1 = require("~bioblocks-viz~/data");
var reducer_1 = require("~bioblocks-viz~/reducer");
var BioblocksVisualization = /** @class */ (function (_super) {
    tslib_1.__extends(BioblocksVisualization, _super);
    function BioblocksVisualization(props) {
        var _this = _super.call(this, props) || this;
        _this.bioblocksHooks = {};
        _this.datasets = immutable_1.Set();
        _this.loadingStatus = 2 /* NOT_STARTED */;
        BioblocksVisualization.activeBioblocksVisualizations = BioblocksVisualization.activeBioblocksVisualizations.add(_this);
        _this.setupDataServices();
        return _this;
    }
    BioblocksVisualization.prototype.componentWillUnmount = function () {
        this.teardown();
    };
    BioblocksVisualization.prototype.addBioblocksHook = function (name, cb) {
        this.bioblocksHooks[name] = cb;
    };
    BioblocksVisualization.prototype.registerDataset = function (name, defaultValue, namespace) {
        if (namespace === void 0) { namespace = 'bioblocks'; }
        this.datasets = this.datasets.add(new data_1.Dataset(name, namespace));
        this.createReducer(name, defaultValue, namespace);
    };
    BioblocksVisualization.prototype.finishLoading = function () {
        this.loadingStatus = 3 /* READY */;
    };
    BioblocksVisualization.prototype.getDatasets = function () {
        return this.datasets;
    };
    BioblocksVisualization.prototype.getComponentBioblocksHooks = function () {
        return this.bioblocksHooks;
    };
    BioblocksVisualization.prototype.getLoadingStatus = function () {
        return this.loadingStatus;
    };
    BioblocksVisualization.prototype.teardown = function () {
        // TODO Can it be enforced that this method is always called?
        BioblocksVisualization.activeBioblocksVisualizations = BioblocksVisualization.activeBioblocksVisualizations.remove(this);
    };
    BioblocksVisualization.prototype.createReducer = function (datasetName, defaultValue, namespace) {
        if (namespace === void 0) { namespace = 'bioblocks'; }
        if (util_1.isArray(defaultValue)) {
            reducer_1.createContainerReducer(datasetName, namespace);
        }
        else if (typeof defaultValue === 'object') {
            reducer_1.createObjectReducer(datasetName, namespace);
        }
        else {
            reducer_1.createValueReducer(datasetName, defaultValue, namespace);
        }
    };
    BioblocksVisualization.getActiveBioblocksVisualizations = function () {
        return BioblocksVisualization.activeBioblocksVisualizations;
    };
    BioblocksVisualization.activeBioblocksVisualizations = immutable_1.Set();
    return BioblocksVisualization;
}(React.Component));
exports.BioblocksVisualization = BioblocksVisualization;
//# sourceMappingURL=BioblocksVisualization.js.map