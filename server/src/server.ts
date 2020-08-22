/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { HelloWorld } from "core";
import {
  createConnection,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  TextDocumentSyncKind,
} from "vscode-languageserver";
import { handleCompletions } from "./handleCompletions";
import notebook from "./Notebook";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

/**
 * This is like a handshake, the client tells us what capabilities it supports
 * and we can respond in turn with the capabilities we support.
 * For now I'm ignoring the capabilities the client supports since the client
 * is assumed to be vscode.
 */
connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
  return result;
});

// handle client completions
handleCompletions(connection);

// Make the text document manager listen on the connection
// for open, change and close text document events
notebook.listen(connection);

// Listen on the connection
connection.listen();

new HelloWorld().sayHello();
