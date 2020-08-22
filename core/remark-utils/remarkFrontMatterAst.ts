import type * as MDAST from "mdast";
import type { Processor, Settings, Transformer } from "unified";
import { select } from "unist-util-select";
import { parse as parseYAML } from "yaml";
import { load as loadYAML, YAMLNode } from "yaml-ast-parser";

export interface Yaml extends MDAST.Literal {
  type: "yaml";
  data: {
    ast: YAMLNode;
    obj: any;
  };
}

export default function remarkFrontMatterAst(
  this: Processor<Settings>
): Transformer {
  return (node) => {
    const yamlNode = select("yaml", node);
    if (yamlNode) {
      let data: Yaml["data"] = {
        ast: loadYAML(yamlNode.value as string),
        obj: parseYAML(yamlNode.value as string),
      };
      yamlNode.data = data;
    }
    yamlNode?.data;
  };
}
