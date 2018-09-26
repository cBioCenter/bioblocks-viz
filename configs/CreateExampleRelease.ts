import { execSync } from 'child_process';
import { copyFileSync, mkdirSync } from 'fs';

const date = new Date(Date.now());

// EcmaScript uses 0-based month indexing, so let's convert it to a more human readable value.
const saneMonth = date.getMonth() + 1;

const paddedMonth = saneMonth <= 9 ? `0${saneMonth}` : `${saneMonth}`;
const paddedDay = date.getDate() <= 9 ? `0${date.getDate()}` : `${date.getDate()}`;
const dirName = `${date.getFullYear()}${paddedMonth}${paddedDay}`;

const distDir = './dist';
const releaseDir = `${distDir}/${dirName}`;

mkdirSync(releaseDir);
copyFileSync(`${distDir}/example.html`, `${releaseDir}/index.html`);

const filesToCopy = ['*example*.bundle.js', 'favicon.ico'];
filesToCopy.forEach(file => {
  execSync(`cp ${distDir}/${file} ${releaseDir}/`);
});

mkdirSync(`${releaseDir}/assets`);
const assetFilesToCopy = ['assets/semantic*', 'assets/themes'];
assetFilesToCopy.forEach(file => {
  execSync(`cp -r ${distDir}/${file} ${releaseDir}/assets/`);
});

execSync(`chmod -R og+rx ${releaseDir}`);

const resultMessage = `Created ${dirName} to be deployed!\n\
To transfer to prod server, run 'scp -r ${releaseDir} $PROD_HOSTNAME'.\n\
Ensure 'PROD_HOSTNAME' is substituted yourself or otherwise set as an environment variable.`;

console.log(resultMessage);
