import { expect } from "chai";
import remark from "remark";
import type * as UNIST from "unist";
import visit from "unist-util-visit";
import { incrementUnistPoint } from "./incrementUnistPoint";
import { normalize } from "./normalize";
import remarkWikilink, { Wikilink } from "./remarkWikilink";

/**
 * Create a remark processor which uses wikilink syntax
 */
function wikilinkProcessor() {
  return remark().use(remarkWikilink);
}

/**
 * Create a Wikilink AST node given the contents of the wikilink
 * @param content the content of the wikilink (between the brackets)
 * @param start the starting position of the first bracket
 */
function createWikilinkNode(content: string, start: UNIST.Point) {
  const contentWithBracket = `[[${content}]]`;
  // content starts after two brackets
  const contentStart = incrementUnistPoint(start, 2);

  // create the wikilink
  const wikilink: Wikilink = {
    data: {
      content,
      identifier: normalize(content),
    },
    children: [
      {
        type: "text",
        value: content,
        position: {
          start: contentStart,
          end: incrementUnistPoint(contentStart, content.length),
          indent: [],
        },
      },
    ],
    type: "wikilink",
    position: {
      start,
      end: incrementUnistPoint(start, contentWithBracket.length),
      indent: [],
    },
  };
  return wikilink;
}

describe("Wikilink", () => {
  it("parses wikilink", () => {
    const processor = wikilinkProcessor();
    const content = "Wiki Link";
    const ast = processor.runSync(processor.parse(`[[${content}]]`));
    visit(ast, "wikilink", (actual) => {
      const expected = createWikilinkNode(content, {
        column: 1,
        line: 1,
        offset: 0,
      });
      expect(actual).to.deep.equal(expected);
    });
  });

  it("ignores reference", () => {
    const processor = wikilinkProcessor();
    const content = "Wiki Link";
    const ast = processor.runSync(processor.parse(`[[${content}]][]`));
    visit(ast, "wikilink", () => {
      throw new Error("expect collapsed reference");
    });
  });

  it("ignores empty content", () => {
    const processor = wikilinkProcessor();
    const content = "         ";
    const ast = processor.runSync(processor.parse(`[[${content}]]`));
    visit(ast, "wikilink", () => {
      throw new Error("expect empty content to be ignored");
    });
  });

  it("parsees with references", () => {
    const processor = wikilinkProcessor();
    const content = "this is the wiki link";
    const ast = processor.runSync(
      processor.parse(`[[${content}]] [reference]`)
    );
    visit(ast, "wikilink", (actual) => {
      const expected = createWikilinkNode(content, {
        column: 1,
        line: 1,
        offset: 0,
      });
      expect(actual).to.deep.equal(expected);
    });
  });
});
