import { expect } from "chai";
import type * as vscode from "vscode-languageserver-types";
import { unistPositionToVscodeRange } from "./unistPositionToVscodeRange";

describe("unist position to vscode range", () => {
  it("converts positions to ranges", () => {
    const actual = unistPositionToVscodeRange({
      start: {
        column: 1,
        line: 1,
      },
      end: {
        column: 100,
        line: 100,
      },
    });
    const expected: vscode.Range = {
      start: {
        character: 0,
        line: 0,
      },
      end: {
        character: 99,
        line: 99,
      },
    };
    expect(actual).to.deep.equal(expected);
  });
});
