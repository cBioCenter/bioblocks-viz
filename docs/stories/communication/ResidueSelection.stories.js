"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var container_1 = require("~bioblocks-viz~/container");
exports.default = {
    component: [container_1.ContactMapContainer, container_1.NGLContainer],
    title: 'communication/Anatomogram',
};
if (window) {
    window.addEventListener('message', function (e) {
        console.log('oi');
        console.log(e);
    });
}
exports.Foo = function () {
    return (React.createElement("div", null,
        React.createElement("iframe", { id: "bioblocks-frame-2", sandbox: 'allow-scripts allow-same-origin', width: "525", height: "530", src: "bioblocks.html", onLoad: function () {
                var iframe = document.getElementById('bioblocks-frame-2');
                // @ts-ignore
                if (iframe && iframe.contentWindow) {
                    // @ts-ignore
                    // tslint:disable-next-line: no-unsafe-any
                    iframe.contentWindow.postMessage({
                        props: {
                            predictedProteins: ['datasets/beta_lactamase/1ZG4.pdb'],
                        },
                        viz: 'NGL',
                    }, '*');
                }
            } })));
};
//# sourceMappingURL=ResidueSelection.stories.js.map