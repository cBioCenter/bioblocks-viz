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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var PIXI = require("pixi.js");
var React = require("react");
var CellContext_1 = require("../context/CellContext");
var ReactHelper_1 = require("../helper/ReactHelper");
var defaultProps = __assign({ canvasBackgroundColor: 0xcccccc, data: {
        links: [],
        nodes: [],
    }, height: 450 }, CellContext_1.initialCellContext, { padding: 0, selectedCategory: '', width: 450 });
exports.SpringComponentWithDefaultProps = ReactHelper_1.withDefaultProps(defaultProps, /** @class */ (function (_super) {
    __extends(SpringComponentClass, _super);
    function SpringComponentClass(props) {
        var _this = _super.call(this, props) || this;
        _this.pixiApp = new PIXI.Application();
        _this.nodeSprites = new PIXI.Container();
        _this.edgeSprites = new PIXI.Container();
        _this.state = __assign({}, _this.state);
        return _this;
    }
    SpringComponentClass.prototype.componentDidMount = function () {
        var _a = this.props, height = _a.height, width = _a.width;
        this.pixiApp = new PIXI.Application(width, height, {
            backgroundColor: this.props.canvasBackgroundColor,
            view: this.canvasElement,
        });
        var pixiApp = this.pixiApp;
        var _b = this.props, data = _b.data, selectedCategory = _b.selectedCategory;
        if (data) {
            pixiApp.stage.removeChildren();
            this.nodeSprites = new PIXI.Container();
            this.edgeSprites = new PIXI.Container();
            this.generateNodeSprites(data.nodes, this.nodeSprites, selectedCategory);
            this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);
            this.centerCanvas(data);
            pixiApp.stage.addChild(this.edgeSprites);
            pixiApp.stage.addChild(this.nodeSprites);
        }
    };
    SpringComponentClass.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _this = this;
        var _a = this.props, data = _a.data, selectedCategory = _a.selectedCategory;
        var isNewData = data && data !== prevProps.data;
        if (isNewData) {
            var pixiApp = this.pixiApp;
            pixiApp.stage.removeChildren();
            this.nodeSprites = new PIXI.Container();
            this.edgeSprites = new PIXI.Container();
            this.generateNodeSprites(data.nodes, this.nodeSprites, selectedCategory);
            this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);
            this.centerCanvas(data);
            pixiApp.stage.addChild(this.edgeSprites);
            pixiApp.stage.addChild(this.nodeSprites);
        }
        else if (selectedCategory !== prevProps.selectedCategory) {
            this.updateNodeSprites(data.nodes, this.nodeSprites, function (node) { return node.category === selectedCategory; });
            this.edgeSprites.removeChildren();
            this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);
            this.centerCanvas(data);
        }
        else if (this.props.currentCells !== prevProps.currentCells) {
            this.updateNodeSprites(data.nodes, this.nodeSprites, function (node) { return _this.props.currentCells.indexOf(node.number) !== -1; });
            this.edgeSprites.removeChildren();
            this.generateLinesSprite(data.links, this.edgeSprites, selectedCategory);
            this.centerCanvas(data);
        }
    };
    SpringComponentClass.prototype.render = function () {
        var _this = this;
        var _a = this.props, height = _a.height, padding = _a.padding, width = _a.width;
        return (React.createElement("div", { id: "SpringComponent", style: { padding: padding } }, React.createElement("canvas", { ref: function (el) { return (_this.canvasElement = el ? el : undefined); }, style: { height: height, width: width } })));
    };
    SpringComponentClass.prototype.generateLinesSprite = function (links, container, category) {
        if (links === void 0) { links = []; }
        var lines = new PIXI.Graphics();
        var _a = this.props, height = _a.height, width = _a.width;
        for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
            var link = links_1[_i];
            var source = link.source;
            var target = link.target;
            if (category && source.category !== category && target.category !== category) {
                continue;
            }
            lines.lineStyle(5, 0xff0000, 1);
            lines.moveTo(source.x, source.y);
            lines.lineTo(target.x, target.y);
        }
        var linesBounds = lines.getBounds();
        var textureRect = new PIXI.Rectangle(linesBounds.x, linesBounds.y, Math.max(width, linesBounds.width), Math.max(height, linesBounds.height));
        var linesTexture = this.pixiApp.renderer.generateTexture(lines, PIXI.SCALE_MODES.LINEAR, width / height, textureRect);
        var linesSprite = new PIXI.Sprite(linesTexture);
        linesSprite.x = textureRect.x;
        linesSprite.y = textureRect.y;
        container.addChild(linesSprite);
    };
    SpringComponentClass.prototype.generateNodeSprites = function (nodes, container, category) {
        if (nodes === void 0) { nodes = []; }
        var SPRITE_IMG_SIZE = 32;
        var scaleFactor = 0.5 * 32 / SPRITE_IMG_SIZE;
        // TODO: Evaluate ParticleContainer is PIXI v5. The v4 version doesn't play nice with sprites rendered via PIXI.Graphics.
        // this.sprites = new PIXI.particles.ParticleContainer(data.nodes.length);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var nodeTexture = new PIXI.Graphics();
            nodeTexture.beginFill(node.colorHex);
            nodeTexture.drawCircle(0, 0, SPRITE_IMG_SIZE / 2);
            nodeTexture.endFill();
            var sprite = new PIXI.Sprite(this.pixiApp.renderer.generateTexture(nodeTexture));
            sprite.x = node.x;
            sprite.y = node.y;
            if (category && node.category !== category) {
                sprite.alpha = 0.1;
            }
            sprite.anchor.set(0.5, 0.5);
            sprite.interactive = true;
            sprite.scale.set(scaleFactor);
            container.addChild(sprite);
        }
    };
    SpringComponentClass.prototype.updateNodeSprites = function (nodes, container, conditionFn) {
        if (nodes === void 0) { nodes = []; }
        for (var i = 0; i < container.children.length; ++i) {
            var node = nodes[i];
            var sprite = container.children[i];
            if (conditionFn(node)) {
                sprite.alpha = 1;
            }
            else {
                sprite.alpha = 0.1;
            }
        }
    };
    SpringComponentClass.prototype.centerCanvas = function (data) {
        var _a = this, edgeSprites = _a.edgeSprites, nodeSprites = _a.nodeSprites;
        var _b = this.props, height = _b.height, width = _b.width;
        var allXs = data.nodes.map(function (node) { return node.x; });
        var allYs = data.nodes.map(function (node) { return node.y; });
        var max = {
            x: d3.max(allXs),
            y: d3.max(allYs),
        };
        var min = {
            x: d3.min(allXs),
            y: d3.min(allYs),
        };
        var dx = max.x - min.x + 50;
        var dy = max.y - min.y + 50;
        var scale = 0.85 / Math.max(dx / width, dy / height);
        var delta = {
            scale: scale - this.nodeSprites.scale.x,
            x: width / 2 - (max.x + min.x) / 2 * scale - nodeSprites.position.x,
            y: height / 2 + 30 - (max.y + min.y) / 2 * scale - nodeSprites.position.y,
        };
        nodeSprites.position.x += delta.x;
        nodeSprites.position.y += delta.y;
        nodeSprites.scale.x += delta.scale;
        nodeSprites.scale.y += delta.scale;
        edgeSprites.position = nodeSprites.position;
        edgeSprites.scale = nodeSprites.scale;
    };
    return SpringComponentClass;
}(React.Component)));
exports.SpringComponent = function (props) { return (React.createElement(CellContext_1.CellContext.Consumer, null, function (_a) {
    var currentCells = _a.currentCells;
    return React.createElement(exports.SpringComponentWithDefaultProps, __assign({}, props, { currentCells: currentCells }));
})); };
