const postcssJs = require("postcss-js");
const postcss = require("postcss");
const R = require("ramda");

const addNewPropertyToFiles = (prop, fn) =>
  R.map(file => R.assoc(prop, fn(file), file));

const EXTENSION_LENGTH = ".css".length;

function getModuleName(fileName) {
  return fileName.slice(
    fileName.indexOf("_") === 0 ? 1 : 0,
    fileName.length - EXTENSION_LENGTH
  );
}

const getModulesNames = addNewPropertyToFiles("module", file =>
  getModuleName(file.fileName)
);

const parseFiles = addNewPropertyToFiles("cssRoot", file =>
  postcss.parse(file.content)
);

const selectors = R.pickBy(R.compose(R.test(/\./), R.nthArg(1)));

const atMediaRules = R.pickBy(R.compose(R.test(/^@/), R.nthArg(1)));

const atMediaClasses = R.compose(R.mergeAll, R.values, atMediaRules);

const getCssObj = R.compose(
  R.converge(R.merge, [selectors, atMediaClasses]),
  postcssJs.objectify
);

const getFilesCssObj = addNewPropertyToFiles("cssObj", file =>
  getCssObj(file.cssRoot)
);

const isClass = selector => selector.indexOf(".") === 0;
const removePseudoSelectors = R.replace(/\:.+/, "");
const removeSpacesAndLineBreaks = R.replace(/\n| /g, "");

const classNames = R.compose(
  R.reduce(
    R.converge(R.concat, [
      R.nthArg(0),
      R.compose(
        R.map(removePseudoSelectors),
        R.filter(isClass),
        R.split(","),
        removeSpacesAndLineBreaks,
        R.nthArg(1)
      )
    ]),
    []
  ),
  Object.keys
);

const getFilesClassNames = addNewPropertyToFiles("classNames", file =>
  classNames(file.cssObj)
);

const clearAPI = R.map(R.pick(["fileName", "module", "classNames"]));

const validateProperties = R.all(
  R.converge(R.and, [R.has("fileName"), R.has("content")])
);

const validateInput = sourceFiles => {
  let files = sourceFiles;
  if (typeof sourceFiles === "string") {
    files = [
      {
        fileName: ".css",
        content: sourceFiles
      }
    ];
  }

  if (!Array.isArray(sourceFiles) && typeof sourceFiles === "object") {
    files = [sourceFiles];
  }

  if (files && files.length > 0 && validateProperties(files)) {
    return sourceFiles;
  }

  throw new Error(
    "Invalid input. Should provide an array of { filename, content }"
  );
};

function getTachyonsClassNames(sourceFiles) {
  return Promise.resolve(sourceFiles)
    .then(validateInput)
    .then(getModulesNames)
    .then(parseFiles)
    .then(getFilesCssObj)
    .then(getFilesClassNames)
    .then(clearAPI);
}

module.exports = getTachyonsClassNames;
