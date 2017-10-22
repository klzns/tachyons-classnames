jest.mock("./readTachyonsSourceFiles.js");

const getTachyonsClassNames = require("./index");

describe("Tachyons Classnames", () => {
  let result;

  beforeAll(() => {
    const sourceFiles = require("./readTachyonsSourceFiles")();
    result = getTachyonsClassNames(sourceFiles);
  });

  it("should have the correct shape", () => {
    const expected = ["fileName", "module", "classNames"];

    const firstResult = result[0];
    const objKeys = Object.keys(firstResult);

    expect(objKeys).toMatchObject(expected);
  });

  it("should have the right module name", () => {
    expect(result[0].module).toBe("no-underscore-file");
    expect(result[1].module).toBe("two-classes");
  });

  it("should get two classes", () => {
    expect(result[1].classNames).toMatchObject([".bar", ".bar--2"]);
  });

  it("should classes with two selectors", () => {
    expect(result[2].classNames).toMatchObject([".one", ".two"]);
  });

  it("should get classes inside media queries", () => {
    expect(result[3].classNames).toMatchObject([
      ".f7",
      ".f-6-ns",
      ".f-headline-ns"
    ]);
  });

  it("should get classes between element selectors", () => {
    expect(result[4].classNames).toMatchObject([".border-box"]);
  });

  it("should remove pseudo selectors", () => {
    expect(result[5].classNames).toMatchObject([
      ".stripe-light",
      ".stripe-dark"
    ]);
  });

  it("should throw on invalid input", () => {
    expect(() => getTachyonsClassNames()).toThrow();
  });
});
