import { expect } from "chai";
import { parseFileSync } from "./parseFile";

describe("parseFile", function () {
  it("parses", () => {
    const result = parseFileSync(
      `---
title: YAML Front Matter
description: A very simple way to add structured data to a page.
---

# Header 1

This is the first paragraph with an [[example of a wikilink]] inside of it.

`
    );

    expect(result);
  });
});
