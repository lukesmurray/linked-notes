import { IConnection, TextDocuments } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * The notebook is a singleton which manages all the markdown documents
 */
class Notebook {
  /**
   * singleton instance of the notebook
   */
  private static _instance: Notebook | undefined;

  /**
   * contains a cache of all the markdown text documents
   */
  private documentCache: TextDocuments<TextDocument>;

  private constructor() {
    this.documentCache = new TextDocuments(TextDocument);

    this.documentCache.onDidOpen((e) => {
      console.log("open", e.document.uri);
    });

    this.documentCache.onDidChangeContent((e) => {
      console.log("change", e.document.uri);
    });
  }

  /**
   * Get the singleton instance of the notebook
   */
  static getInstance(): Notebook {
    if (this._instance === undefined) {
      this._instance = new Notebook();
    }
    return this._instance;
  }

  /**
   * Listen to changes on the connection such as low level events about documents.
   * @param connection The connection to listen on.
   */
  public listen = (connection: IConnection) => {
    this.documentCache.listen(connection);
  };
}

const notebook = Notebook.getInstance();

export default notebook;
