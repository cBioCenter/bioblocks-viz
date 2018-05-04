"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var SequenceViewer = /** @class */ (function (_super) {
    __extends(SequenceViewer, _super);
    function SequenceViewer(props) {
        return _super.call(this, props) || this;
    }
    SequenceViewer.prototype.render = function () {
        var _a = this.props, data = _a.data, selectedResNum = _a.selectedResNum;
        if (data) {
            var fullSeq = data.getSequence().join('');
            return (React.createElement("div", { id: "SequenceViewer" },
                this.renderFullSequence(fullSeq, selectedResNum),
                data.residueMap.list.map(function (value, index) {
                    if (selectedResNum &&
                        value.resname === data.residueMap.get(data.residueStore.residueTypeId[selectedResNum]).resname) {
                        return React.createElement("div", { key: index }, value.resname + " was selected!");
                    }
                    else {
                        return React.createElement("div", { key: index }, value.resname);
                    }
                })));
        }
        return null;
    };
    SequenceViewer.prototype.renderFullSequence = function (sequence, selectedResNum) {
        if (selectedResNum === void 0) { selectedResNum = -1; }
        return (React.createElement("div", { style: { width: 400, maxHeight: 400, wordWrap: 'break-word' } },
            sequence.substr(0, selectedResNum + 1),
            React.createElement("span", { style: { color: 'red', fontSize: 24 } }, sequence[selectedResNum]),
            sequence.substr(selectedResNum + 1)));
    };
    return SequenceViewer;
}(React.Component));
exports.SequenceViewer = SequenceViewer;
