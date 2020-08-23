import { expect } from "chai";
import type * as vscode from "vscode-languageserver-types";
import { unistPointToVscodePosition } from "./unistPointToVscodePosition";

describe("unist point to vscode position", () => {
  it("converts points to positions", () => {
    const actual = unistPointToVscodePosition({
      line: 1,
      column: 1,
    });
    const expected: vscode.Position = {
      character: 0,
      line: 0,
    };
    expect(actual.line).to.equal(expected.line);
    expect(actual.character).to.equal(expected.character);
  });
});
