"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var addon_knobs_1 = require("@storybook/addon-knobs");
var container_1 = require("~bioblocks-viz~/container");
exports.default = {
    component: container_1.AnatomogramContainerClass,
    title: 'visualization/Anatomogram',
};
exports.WithReact = function () { return (React.createElement(container_1.AnatomogramContainer, { species: addon_knobs_1.select('species', ['homo_sapiens', 'mus_musculus'], 'homo_sapiens') })); };
exports.WithIFrame = function () { return (React.createElement("div", null,
    React.createElement("iframe", { id: "bioblocks-frame", sandbox: 'allow-scripts allow-same-origin', width: "525", height: "530", src: "bioblocks.html", onLoad: function () {
            var iframe = document.getElementById('bioblocks-frame');
            // @ts-ignore
            if (iframe && iframe.contentWindow) {
                // @ts-ignore
                // tslint:disable-next-line: no-unsafe-any
                iframe.contentWindow.postMessage({
                    props: {
                        species: 'mus_musculus',
                    },
                    viz: 'Anatomogram',
                }, '*');
            }
        } }))); };
//# sourceMappingURL=Anatomogram.stories.js.map