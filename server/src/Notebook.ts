import { TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * The notebook is a singleton which manages all the markdown documents
 */
class Notebook {
  private static _instance: Notebook | undefined;

  private constructor() {}

  /**
   * document manager for markdown documents
   */
  private documents: TextDocuments<TextDocument> = new TextDocuments(
    TextDocument
  );

  static getInstance(): Notebook {
    if (this._instance === undefined) {
      this._instance = new Notebook();
    }
    return this._instance;
  }

  /**
   * Listens for `low level` notification on the given connection to
   * update the text documents managed by this instance.
   *
   * Proxy for TextDocuments Listen method
   *
   * @param connection The connection to listen on.
   */
  public listen: TextDocuments<TextDocument>["listen"] = (connection) => {
    this.documents.listen(connection);
  };
}

const notebook = Notebook.getInstance();

export default notebook;
