"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var immutable_1 = require("immutable");
var React = require("react");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
// tslint:disable:import-name match-default-export-name
var react_iframe_comm_1 = require("react-iframe-comm");
// tslint:enable:import-name match-default-export-name
var action_1 = require("~bioblocks-viz~/action");
var component_1 = require("~bioblocks-viz~/component");
var container_1 = require("~bioblocks-viz~/container");
var helper_1 = require("~bioblocks-viz~/helper");
var reducer_1 = require("~bioblocks-viz~/reducer");
var selector_1 = require("~bioblocks-viz~/selector");
var SpringContainerClass = /** @class */ (function (_super) {
    tslib_1.__extends(SpringContainerClass, _super);
    function SpringContainerClass(props) {
        var _this = _super.call(this, props) || this;
        _this.onReady = function () {
            return;
        };
        _this.onReceiveMessage = function (msg) {
            var _a = _this.props, currentCells = _a.currentCells, setCurrentCategory = _a.setCurrentCategory, setCurrentCells = _a.setCurrentCells;
            var data = msg.data;
            switch (data.type) {
                case 'selected-category-update':
                case 'selected-cells-update': {
                    var _b = data.payload, currentCategory = _b.currentCategory, indices = _b.indices;
                    setCurrentCategory(currentCategory ? currentCategory : '');
                    setCurrentCells(indices);
                    break;
                }
                case 'loaded': {
                    _this.setState({
                        postMessageData: {
                            payload: {
                                indices: currentCells.toArray(),
                            },
                            type: 'init',
                        },
                    });
                    break;
                }
                default: {
                    if (msg.isTrusted && Object.keys(msg).length === 1) {
                        return;
                    }
                    else {
                        console.log("Got this msg for ya: " + JSON.stringify(msg));
                    }
                }
            }
        };
        _this.generateSpringURL = function (dataset) { return _this.props.springSrc + "?" + dataset; };
        _this.state = {
            postMessageData: {
                payload: {},
                type: 'init',
            },
            springUrl: _this.generateSpringURL(_this.props.datasetLocation),
        };
        return _this;
    }
    SpringContainerClass.prototype.setupDataServices = function () {
        reducer_1.createSpringReducer();
    };
    SpringContainerClass.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, datasetLocation = _a.datasetLocation, datasetsURI = _a.datasetsURI, dispatchSpringFetch = _a.dispatchSpringFetch;
        dispatchSpringFetch(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, helper_1.fetchSpringData(datasetsURI + "/" + datasetLocation)];
        }); }); });
    };
    SpringContainerClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.props, currentCells = _a.currentCells, datasetLocation = _a.datasetLocation;
        if (currentCells !== prevProps.currentCells) {
            this.setState({
                postMessageData: {
                    payload: {
                        indices: currentCells.toArray(),
                    },
                    type: 'selected-cells-update',
                },
            });
        }
        else if (prevProps.datasetLocation !== datasetLocation) {
            var springUrl = this.generateSpringURL(datasetLocation);
            this.setState({
                springUrl: springUrl,
            });
        }
    };
    SpringContainerClass.prototype.render = function () {
        var _a = this.props, headerHeight = _a.headerHeight, iconSrc = _a.iconSrc, isFullPage = _a.isFullPage, springHeight = _a.springHeight, springWidth = _a.springWidth;
        var _b = this.state, postMessageData = _b.postMessageData, springUrl = _b.springUrl;
        var attributes = {
            allowFullScreen: true,
            height: springHeight + headerHeight,
            src: springUrl,
            width: springWidth,
        };
        var targetOriginPieces = springUrl.split('/');
        return (React.createElement(react_redux_1.Provider, { store: reducer_1.BBStore },
            React.createElement(component_1.ComponentCard, { componentName: SpringContainerClass.displayName, iconSrc: iconSrc, isFramedComponent: true, isFullPage: isFullPage, frameHeight: springHeight, frameWidth: springWidth },
                React.createElement(react_iframe_comm_1.default, { attributes: attributes, postMessageData: postMessageData, handleReady: this.onReady, handleReceiveMessage: this.onReceiveMessage, targetOrigin: targetOriginPieces[0] + "//" + targetOriginPieces[2] }))));
    };
    SpringContainerClass.defaultProps = {
        categories: immutable_1.Set(),
        currentCells: immutable_1.Set(),
        datasetLocation: '../datasets/hpc/full',
        datasetsURI: '',
        dispatchSpringFetch: helper_1.EMPTY_FUNCTION,
        headerHeight: 0,
        isFullPage: false,
        padding: 0,
        selectedCategory: '',
        setCurrentCategory: helper_1.EMPTY_FUNCTION,
        setCurrentCells: helper_1.EMPTY_FUNCTION,
        springGraphData: {
            links: new Array(),
            nodes: new Array(),
        },
        springHeight: 1150,
        springSrc: window.location.origin + "/" + window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/')) + "/SPRING/springViewer.html",
        springWidth: 1150,
    };
    SpringContainerClass.displayName = 'SPRING';
    return SpringContainerClass;
}(container_1.BioblocksVisualization));
exports.SpringContainerClass = SpringContainerClass;
var mapStateToProps = function (state) { return ({
    categories: selector_1.getCategories(state, undefined),
    currentCells: selector_1.selectCurrentItems(state, 'cells'),
    springGraphData: selector_1.getGraphData(state),
}); };
var mapDispatchToProps = function (dispatch) {
    return redux_1.bindActionCreators({
        dispatchSpringFetch: action_1.fetchSpringGraphData,
        setCurrentCategory: action_1.createSpringActions().category.set,
        setCurrentCells: action_1.createContainerActions('cells').set,
    }, dispatch);
};
exports.SpringContainer = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(SpringContainerClass);
//# sourceMappingURL=SpringContainer.js.map