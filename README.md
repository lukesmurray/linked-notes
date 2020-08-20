# Linked Notes

A tool for parsing markdown notes specifically for academic note taking.

Given a directory of markdown notes this tool can parse each note into a structured representation and implements an efficient cache for creating and editing references between those notes.

The two types of references the tool supports are wikilinks and citations.

## Design Goals

- storage independence
  - markdown files can be stored on disk, through a cloud program, or in a database.
  - linked notes will define an interface `NotebookStorage` which contains functions for reading markdown documents, and notifying linked notes when any markdown documents are updated, added, or deleted in the notebook.
- cache implementation
  - linked notes will provide a cache for a `Notebook`
  - the cache will make reopening a notebook very quick
  - the cache will be serializable and can be exported or imported to linked notes
  - the cache can be used to parse as few documents as possible during semantic changes such as deleting a document, renaming a document, or moving a document in the notebook
- references
  - linked notes will support referencing markdown files in a notebook using `[[wikilink]]` syntax
  - linked notes will support [pandoc-citeproc](https://github.com/jgm/pandoc-citeproc) style citations

## API Design

Here is an example of the API I am imagining.

```ts
import Notebook, {
  LocalNotebookStorage,
  LocalStorageCache,
} from "linked-notes";

const notebook = new Notebook({
  storage: new LocalNotebookStorage({
    root: "src",
    cache: new LocalStorageCache({
      key: "foo",
    }),
  }),
  mdFileRegex: /.*.(?:md|MD)/gm,
  cslJSONFile: "library.json",
});
```
