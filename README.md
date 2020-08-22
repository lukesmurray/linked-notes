# LSP Example

## Developing

### Running the Language Server in vscode

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode the extension will be active.
  - The initial workspace for testing is supplied in `client/testFixture`

### Logging Support

- set `"linkedNotesLanguageServer.trace.server": "verbose"` in your workspace settings to view the language server communications in the output channel
- you can save and load the file to microsoft's [LSP Inspector](https://microsoft.github.io/language-server-protocol/inspector/)
