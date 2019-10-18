"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var container_1 = require("~bioblocks-viz~/container");
var data_1 = require("~bioblocks-viz~/data");
var reducer_1 = require("~bioblocks-viz~/reducer");
var BBFrame = /** @class */ (function (_super) {
    tslib_1.__extends(BBFrame, _super);
    function BBFrame(props) {
        var _this = _super.call(this, props) || this;
        _this.onMessage = function (msg) {
            var currentViz = _this.state.currentViz;
            _this.setState({
                currentViz: msg.data.viz !== undefined ? msg.data.viz : currentViz,
                vizData: msg.data,
                vizProps: msg.data.props,
            });
        };
        _this.renderViz = function (viz, vizData, vizProps) {
            switch (viz) {
                case data_1.VIZ_TYPE.ANATOMOGRAM:
                    return React.createElement(container_1.AnatomogramContainer, tslib_1.__assign({}, vizProps));
                case data_1.VIZ_TYPE.CONTACT_MAP:
                    return React.createElement(container_1.ContactMapContainer, tslib_1.__assign({}, vizProps));
                case data_1.VIZ_TYPE.NGL:
                    return React.createElement(container_1.NGLContainer, tslib_1.__assign({}, vizProps));
                case data_1.VIZ_TYPE.SPRING:
                    return React.createElement(container_1.SpringContainer, tslib_1.__assign({}, vizProps));
                case data_1.VIZ_TYPE.UMAP_SEQUENCE:
                    return _this.renderUmapSeq(vizData, vizProps);
                default:
                    return React.createElement("div", null, "Unsupported viz " + viz + "!");
            }
        };
        _this.state = {
            currentViz: props.viz,
            vizData: {},
            vizProps: {},
        };
        return _this;
    }
    BBFrame.prototype.componentDidMount = function () {
        window.addEventListener('message', this.onMessage);
    };
    BBFrame.prototype.componentWillUnmount = function () {
        window.removeEventListener('message', this.onMessage);
    };
    BBFrame.prototype.render = function () {
        var style = this.props.style;
        var _a = this.state, currentViz = _a.currentViz, vizData = _a.vizData, vizProps = _a.vizProps;
        var combinedStyle = tslib_1.__assign({}, style);
        return currentViz !== undefined ? (React.createElement("div", { style: combinedStyle }, this.renderViz(currentViz, vizData, vizProps))) : null;
    };
    BBFrame.prototype.renderUmapSeq = function (vizData, vizProps) {
        return (React.createElement(container_1.UMAPSequenceContainer, tslib_1.__assign({ allSequences: vizData.seqs.map(function (seq, index) {
                return new data_1.SeqRecord(new data_1.Seq(seq), {
                    metadata: {
                        class: vizData.annotations ? vizData.annotations[index] : '',
                    },
                    name: vizData.names[index],
                });
            }) }, vizProps)));
    };
    BBFrame.defaultProps = {
        style: {},
        viz: undefined,
    };
    return BBFrame;
}(React.Component));
exports.BBFrame = BBFrame;
var bioblocksFrame = document.getElementById('bioblocks-frame');
if (bioblocksFrame) {
    ReactDOM.render(React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
        React.createElement(BBFrame, null)), document.getElementById('bioblocks-frame'));
}
if (module.hot) {
    module.hot.accept();
}
//# sourceMappingURL=BBFrame.js.map