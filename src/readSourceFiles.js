const fs = require("fs-extra");
const path = require("path");
const Promise = require("bluebird");
const R = require("ramda");

function getTachyonsFiles() {
  const tachyonsMainPath = require.resolve("tachyons");
  const tachyonSrcPath = path.join(tachyonsMainPath, "..", "..", "src");

  return fs.readdir(tachyonSrcPath).then(files => [tachyonSrcPath, files]);
}

const readFile = basePath => fileName =>
  Promise.all([fileName, fs.readFile(path.join(basePath, fileName), "utf-8")]);

const createFileObj = ([fileName, content]) => ({ fileName, content });

function readAllFiles([basePath, files]) {
  return Promise.map(files, readFile(basePath)).then(files =>
    files.map(createFileObj)
  );
}

const readSourceFiles = R.composeP(readAllFiles, getTachyonsFiles);

module.exports = readSourceFiles;
