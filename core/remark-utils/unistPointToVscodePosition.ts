import type * as UNIST from "unist";
import type * as vscode from "vscode-languageserver-types";

export function unistPointToVscodePosition(
  point: UNIST.Point
): vscode.Position {
  return {
    line: point.line - 1,
    character: point.column - 1,
  };
}
