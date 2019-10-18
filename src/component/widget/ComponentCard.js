"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ReactDOM = require("react-dom");
var semantic_ui_react_1 = require("semantic-ui-react");
var widget_1 = require("~bioblocks-viz~/component/widget");
var ComponentCard = /** @class */ (function (_super) {
    tslib_1.__extends(ComponentCard, _super);
    function ComponentCard(props) {
        var _this = _super.call(this, props) || this;
        _this.cardRef = null;
        _this.renderCard = function (card, isFullPage, expandedStyle) {
            if (isFullPage) {
                return (React.createElement(semantic_ui_react_1.Modal, { closeOnDimmerClick: true, closeOnEscape: true, onClose: _this.onFullPageToggle, open: true, size: 'large', style: tslib_1.__assign(tslib_1.__assign({}, expandedStyle), { willChange: 'unset' }) }, card));
            }
            else {
                return card;
            }
        };
        _this.renderCardChildren = function () {
            var _a = _this.props, children = _a.children, headerHeight = _a.headerHeight, isFramedComponent = _a.isFramedComponent;
            var framedStyle = _this.state.framedStyle;
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { style: { height: '7%' } }, _this.renderTopMenu(headerHeight)),
                React.createElement("div", { style: { height: '90%', width: '100%' } }, isFramedComponent ? React.createElement("div", { style: framedStyle }, children) : children),
                React.createElement("div", { style: { height: '3%' } }, _this.renderDock())));
        };
        _this.renderDock = function () {
            var _a = _this.props, dockItems = _a.dockItems, isDataReady = _a.isDataReady;
            return dockItems.length >= 1 && React.createElement(widget_1.ComponentDock, { dockItems: dockItems, visible: isDataReady });
        };
        _this.renderTopMenu = function (height) {
            var _a = _this.props, componentName = _a.componentName, iconSrc = _a.iconSrc, menuItems = _a.menuItems;
            var isFullPage = _this.state.isFullPage;
            return (React.createElement(widget_1.ComponentMenuBar, { componentName: componentName, height: height, iconSrc: iconSrc, isExpanded: isFullPage, menuItems: menuItems, onExpandToggleCb: _this.onFullPageToggle }));
        };
        _this.onBorderClick = function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var cardElement;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cardElement = ReactDOM.findDOMNode(this.cardRef);
                        if (!(event.offsetX < 0 ||
                            event.offsetY < 0 ||
                            event.offsetX > cardElement.clientWidth ||
                            event.offsetY > cardElement.clientHeight)) return [3 /*break*/, 2];
                        return [4 /*yield*/, document.exitFullscreen()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        _this.onFullPageToggle = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var isFullPage, cardElement;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isFullPage = this.state.isFullPage;
                        cardElement = ReactDOM.findDOMNode(this.cardRef);
                        if (!(cardElement && !isFullPage)) return [3 /*break*/, 2];
                        cardElement.onclick = this.onBorderClick;
                        return [4 /*yield*/, cardElement.requestFullscreen()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, document.exitFullscreen()];
                    case 3:
                        _a.sent();
                        if (cardElement) {
                            cardElement.removeEventListener('click', this.onBorderClick);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.state = {
            framedStyle: {
                transformOrigin: 'top left',
            },
            isFullPage: props.isFullPage,
        };
        return _this;
    }
    ComponentCard.prototype.componentDidMount = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.props.isFramedComponent) return [3 /*break*/, 2];
                        window.onresize = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!this.props.isFramedComponent) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.resizeFramedComponent()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, this.resizeFramedComponent()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        document.onfullscreenchange = function () {
                            var isFullPage = _this.state.isFullPage;
                            _this.setState({
                                isFullPage: !isFullPage,
                            });
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    ComponentCard.prototype.componentWillUnmount = function () {
        document.onfullscreenchange = null;
        var cardElement = ReactDOM.findDOMNode(this.cardRef);
        if (cardElement) {
            cardElement.removeEventListener('click', this.onBorderClick);
        }
    };
    ComponentCard.prototype.componentDidUpdate = function (prevProps, prevState) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isFullPage;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isFullPage = this.state.isFullPage;
                        if (!(isFullPage !== prevState.isFullPage)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.resizeFramedComponent()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ComponentCard.prototype.render = function () {
        var _this = this;
        var _a = this.props, expandedStyle = _a.expandedStyle, height = _a.height, width = _a.width;
        var isFullPage = this.state.isFullPage;
        var heightAsNumber = typeof height === 'string' ? parseInt(height, 10) : height;
        var cardStyle = tslib_1.__assign({ maxWidth: 'unset', padding: '0 0 0 5px' }, (isFullPage
            ? tslib_1.__assign(tslib_1.__assign({}, expandedStyle), { padding: '5px', border: '5em black solid' }) : { height: heightAsNumber * 1.01 + "px", width: width }));
        return (React.createElement(semantic_ui_react_1.Card, { centered: true, className: 'bioblocks-component-card', ref: function (ref) { return (_this.cardRef = ref); }, style: cardStyle }, this.renderCardChildren()));
        // return this.renderCard(card, isFullPage, expandedStyle);
    };
    ComponentCard.prototype.resizeFramedComponent = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, frameHeight, frameWidth, headerHeight, _b, framedStyle, isFullPage, cardElement, iFrameNodeStyle, refHeight, refWidth;
            return tslib_1.__generator(this, function (_c) {
                _a = this.props, frameHeight = _a.frameHeight, frameWidth = _a.frameWidth, headerHeight = _a.headerHeight;
                _b = this.state, framedStyle = _b.framedStyle, isFullPage = _b.isFullPage;
                cardElement = ReactDOM.findDOMNode(this.cardRef);
                if (cardElement) {
                    iFrameNodeStyle = window.getComputedStyle(cardElement);
                    if (iFrameNodeStyle && iFrameNodeStyle.width !== null && iFrameNodeStyle.height !== null) {
                        document.body.style.overflowY = isFullPage ? 'hidden' : 'auto';
                        refHeight = parseInt(iFrameNodeStyle.height, 10) - 18;
                        refWidth = parseInt(iFrameNodeStyle.width, 10) - 10;
                        this.setState({
                            framedStyle: tslib_1.__assign(tslib_1.__assign({}, framedStyle), { transform: "scale(calc(" + refWidth + "/" + frameWidth + "),calc((" + refHeight + " - " + headerHeight + ")/" + frameHeight + "))" }),
                        });
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    ComponentCard.defaultProps = {
        dockItems: [],
        expandedStyle: {
            height: '85vh',
            width: '85vh',
        },
        frameHeight: 0,
        frameWidth: 0,
        headerHeight: 20,
        height: '575px',
        iconSrc: 'assets/icons/bio-blocks-icon.svg',
        isDataReady: false,
        isFramedComponent: false,
        isFullPage: false,
        menuItems: [],
        padding: 0,
        showSettings: false,
        width: '575px',
    };
    return ComponentCard;
}(React.Component));
exports.ComponentCard = ComponentCard;
//# sourceMappingURL=ComponentCard.js.map