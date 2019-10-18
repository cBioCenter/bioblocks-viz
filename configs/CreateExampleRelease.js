"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var date = new Date(Date.now());
// EcmaScript uses 0-based month indexing, so let's convert it to a more human readable value.
var saneMonth = date.getMonth() + 1;
var paddedMonth = saneMonth <= 9 ? "0" + saneMonth : "" + saneMonth;
var paddedDay = date.getDate() <= 9 ? "0" + date.getDate() : "" + date.getDate();
var dirName = "" + date.getFullYear() + paddedMonth + paddedDay;
var distDir = './dist';
var releaseDir = distDir + "/" + dirName;
fs_1.mkdirSync(releaseDir);
fs_1.copyFileSync(distDir + "/index.html", releaseDir + "/index.html");
var filesToCopy = ['*index*.bundle.js', 'favicon.ico'];
filesToCopy.forEach(function (file) {
    child_process_1.execSync("cp " + distDir + "/" + file + " " + releaseDir + "/");
});
fs_1.mkdirSync(releaseDir + "/assets");
var assetFilesToCopy = ['assets/semantic*', 'assets/themes'];
assetFilesToCopy.forEach(function (file) {
    child_process_1.execSync("cp -r " + distDir + "/" + file + " " + releaseDir + "/assets/");
});
child_process_1.execSync("chmod -R og+rx " + releaseDir);
var resultMessage = "Created " + dirName + " to be deployed!\nTo transfer to prod server, run 'scp -r " + releaseDir + " $PROD_HOSTNAME'.\nEnsure 'PROD_HOSTNAME' is substituted yourself or otherwise set as an environment variable.";
console.log(resultMessage);
//# sourceMappingURL=CreateExampleRelease.js.map