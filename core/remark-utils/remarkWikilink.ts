import type * as MDAST from "mdast";
import type { Plugin, Processor, Settings } from "unified";
import { Callable } from "../ts-utils/Callable";
import type {
  IInlineTokenizer,
  RemarkParser,
  TokenizeReturn,
} from "../types/customRemarkTypes";
import { incrementUnistPoint } from "./incrementUnistPoint";
import { normalize } from "./normalize";

/**
 * A wikilink is based on a commonmark [link label](https://spec.commonmark.org/0.29/#link-label)
 *
 * It begins with two left brackets `[[` and ends with two right brackets `]]`.
 * Between these brackets there must be at last one non-whitespace-character.
 */

export interface Wikilink extends MDAST.Parent {
  type: "wikilink";
  data: {
    /**
     * the raw content of the wikilink
     */
    content: string;
    /**
     * the normalized content of the wikilink, used for matching link labels
     * see normalized forms in https://spec.commonmark.org/0.29/#link-label
     */
    identifier: string;
  };
  /**
   * the child nodes of the wikilink
   */
  children: MDAST.StaticPhrasingContent[];
}

function remarkWikilink(this: Processor<Settings>): void {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const methods = Parser.prototype.inlineMethods;

  let tokenizeWikilink: Callable<IInlineTokenizer>;

  tokenizeWikilink = function (
    this: RemarkParser,
    eat,
    value,
    silent
  ): TokenizeReturn {
    const leftSquareBracket = "[";
    const rightSquareBracket = "]";
    const backslash = "\\";
    /**
     * shortcut reference link is [foo]
     * https://spec.commonmark.org/0.29/#shortcut-reference-link
     */
    const shortcut = "shortcut";
    /**
     * collapsed reference link is [foo][]
     * https://spec.commonmark.org/0.29/#collapsed-reference-link
     */
    const collapsed = "collapsed";
    /**
     * full reference link is [foo][bar]
     * https://spec.commonmark.org/0.29/#full-reference-link
     */
    const full = "full";
    const length = value.length;
    let index = 0;
    let intro = "";
    let character = value.charAt(index);

    // eat the opening brackets
    if (character !== leftSquareBracket) {
      return;
    }
    index++;
    intro += character;

    character = value.charAt(index);
    if (character !== leftSquareBracket) {
      return;
    }
    index++;
    intro += character;

    // eat the text
    let depth = 1;
    let queue = "";
    while (index < length) {
      character = value.charAt(index);

      // no brackets in wikilinks
      if (character === leftSquareBracket) {
        return;
      } else if (character === rightSquareBracket) {
        if (depth === 1 && value.charAt(index + 1) === rightSquareBracket) {
          character = value.charAt(++index);
          break;
        }

        depth--;
      }

      if (character === backslash) {
        queue += backslash;
        character = value.charAt(++index);
      }

      queue += character;
      index++;
    }

    let content = queue;
    let subvalue = intro + queue;

    if (character !== rightSquareBracket) {
      return;
    }

    // check content is not empty or just whitespace
    if (content.replace(/\s/g, "").length === 0) {
      return;
    }

    subvalue += rightSquareBracket;
    subvalue += character;

    // check for reference link
    index++;
    character = value.charAt(index);
    let referenceType = shortcut;
    if (character === leftSquareBracket) {
      let referenceIdentifier = "";
      index++;
      while (index < length) {
        character = value.charAt(index);

        if (
          character === leftSquareBracket ||
          character === rightSquareBracket
        ) {
          break;
        }

        if (character === backslash) {
          referenceIdentifier += character;
          character = value.charAt(++index);
        }

        referenceIdentifier += character;
        index++;
      }

      if (character === rightSquareBracket) {
        referenceType = referenceIdentifier ? full : collapsed;
      }
    }

    // if we detected a full or collapsed reference link then exit
    // this is a reference now not a wikilink
    if (referenceType !== shortcut) {
      return;
    }

    let identifier = normalize(content);

    if (silent) {
      return true;
    }

    let now = eat.now();
    now = incrementUnistPoint(now, intro.length);
    let node: Wikilink = {
      type: "wikilink",
      children: (this.tokenizeInline(
        content,
        now
      ) as unknown) as MDAST.StaticPhrasingContent[],
      data: {
        content,
        identifier,
      },
    };
    return eat(subvalue)(node);
  };

  const tokenizerProperties: Pick<IInlineTokenizer, keyof IInlineTokenizer> = {
    locator: (value: string, fromIndex: number) => {
      return value.indexOf("[[", fromIndex);
    },
  };

  const tokenizer: IInlineTokenizer = Object.assign(
    tokenizeWikilink,
    tokenizerProperties
  );

  // add a tokenizer for wikilink
  tokenizers.wikilink = tokenizeWikilink;
  // run the wikilink tokenizer before references
  methods.splice((methods.indexOf("reference") as number) + 1, 0, "wikilink");
}

export default remarkWikilink as Plugin;
