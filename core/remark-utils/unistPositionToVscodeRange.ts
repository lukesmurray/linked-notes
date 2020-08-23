import type * as UNIST from "unist";
import * as vscode from "vscode-languageserver-types";
import { unistPointToVscodePosition } from "./unistPointToVscodePosition";

export function unistPositionToVscodeRange(
  position: UNIST.Position
): vscode.Range {
  return {
    start: unistPointToVscodePosition(position.start),
    end: unistPointToVscodePosition(position.end),
  };
}
