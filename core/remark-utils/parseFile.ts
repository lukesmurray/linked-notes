import remark from "remark";
import remarkFrontmatter from "remark-frontmatter";
import type * as UNIST from "unist";
import remarkFrontMatterAst from "./remarkFrontMatterAst";
import remarkWikilink from "./remarkWikilink";

function createProcessor() {
  return remark()
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkWikilink)
    .use(remarkFrontMatterAst);
}

function buildAST(processor: ReturnType<typeof createProcessor>, text: string) {
  return processor.run(processor.parse(text));
}

function buildASTSync(
  processor: ReturnType<typeof createProcessor>,
  text: string
) {
  return processor.runSync(processor.parse(text));
}

function parseAST(ast: UNIST.Node) {
  return ast;
}

export function parseFileSync(text: string) {
  return parseAST(buildASTSync(createProcessor(), text));
}

export function parseFile(text: string) {
  return buildAST(createProcessor(), text).then((ast) => parseAST(ast));
}
