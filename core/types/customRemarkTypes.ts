/**
 * type definitions for writing a remark plugin
 */

import type { Parser } from "unified";
import type * as UNIST from "unist";
import type { VFile } from "vfile";

export interface RemarkParser extends Parser {
  file: VFile;

  // state
  inList: boolean;
  inBlock: boolean;
  inLink: boolean;
  atStart: boolean;

  // untyped
  options: any;
  setOptions: any;
  toOffset: any;
  unescape: any;
  decode: any;

  // toggles
  exitStart: any;
  enterList: any;
  enterLink: any;
  enterBlock: any;

  /**
   * map from block type to block tokenizer
   */
  blockTokenizers: Record<string, any>;

  /**
   * map from inline type to inline tokenizer
   */
  inlineTokenizers: Record<string, IInlineTokenizer>;

  /**
   * set precedence of block tokenizers.
   * the values are the keys of the block tokenizers
   */
  blockMethods: string[];

  /**
   * set precedence of inline tokenizers
   * the values are the keys of the inline tokenizers
   */
  inlineMethods: string[];

  /**
   * tokenize a block
   */
  tokenizeBlock: TokenizeFunc;

  /**
   * tokenize inline
   */
  tokenizeInline: TokenizeFunc;
}

interface TokenizeFunc {
  (value: string, location: UNIST.Point): TokenizeReturn;
}

/**
 * Add positional information to the node
 * see for add https://github.com/remarkjs/remark/tree/master/packages/remark-parse#addnode-parent
 */
export interface InlineTokenizerAdd {
  (node: UNIST.Node, parent?: UNIST.Node): UNIST.Node;

  /**
   * Return positional information that would be patched on Node by Add
   */
  test: () => UNIST.Position;
}

/**
 * Eats up tokens at the current value
 *
 * see for eat https://github.com/remarkjs/remark/tree/master/packages/remark-parse#eatsubvalue
 */
export interface InlineTokenizerEat {
  /**
   * get the current point, the end of the most recent eat
   */
  now: () => UNIST.Point;
  /**
   * eat a string at the start of value. The string is determined by subValue
   */
  (subValue: string): InlineTokenizerAdd;
}

/**
 * If silent is true returns a boolean whether a node can be found at the start of value.
 * In normal mode returns a Node if it can be found at the start of value
 */
export type TokenizeReturn = UNIST.Node | boolean | undefined;

/**
 * Tokenizers are responsible for breaking up strings into entities
 *
 * There are two types of tokenizers: block level and inline level.
 * Both are functions, and work the same, but inline tokenizers must have a
 * locator.
 *
 * Tokenizers test whether a document starts with a certain syntactic entity.
 * In silent mode, they return whether that test passes. In normal mode, they
 * consume that token, a process which is called “eating”.
 */
export interface IInlineTokenizer {
  (
    /**
     * eat when applicable an entity
     */
    eat: InlineTokenizerEat,
    /**
     * value which may start an entity
     */
    value: string,
    /**
     * whether to detect or consume
     * see silent https://github.com/remarkjs/remark/tree/master/packages/remark-parse#function-tokenizereat-value-silent
     */
    silent: boolean
  ): TokenizeReturn;
  /**
   * For performance reasons the locator determines a possible start to the value
   * see locator https://github.com/remarkjs/remark/tree/master/packages/remark-parse#tokenizerlocatorvalue-fromindex
   */
  locator: (value: string, fromIndex: number) => number;
  /**
   * Whether nodes can only be found at the beginning of the document
   */
  onlyAtStart?: boolean;
  /**
   * Whether nodes cannot be in block quotes or lists
   */
  notInBlock?: boolean;
  /**
   * Whether nodes cannot be in lists
   */
  notInList?: boolean;
  /**
   * Whether nodes cannot be in links
   */
  notInLink?: boolean;
}
