const fs = require("fs");
const path = require("path");
const R = require("ramda");

function getTachyonsFiles(packageName) {
  const tachyonsMainPath = require.resolve(packageName);
  const basePath = path.join(tachyonsMainPath, "..", "..", "src");

  const files = fs.readdirSync(basePath);

  return { basePath, files };
}

function readAllFiles({ basePath, files }) {
  return files.map(readFile(basePath));
}

function readFile(basePath) {
  return fileName => {
    const content = fs.readFileSync(path.join(basePath, fileName), "utf-8");
    return { fileName, content };
  };
}

const readSourceFiles = R.pipe(getTachyonsFiles, readAllFiles);

module.exports = readSourceFiles;
