import { visit } from "unist-util-visit";
import { u } from "unist-builder";

import octicons from "@primer/octicons";

// Extend the String prototype to include a toTitleCase method
String.prototype.toTitleCase = function () {
  return this.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

class Callout {
  static NOTE = "NOTE";
  static TIP = "TIP";
  static IMPORTANT = "IMPORTANT";
  static WARNING = "WARNING";
  static CAUTION = "CAUTION";

  static toIcon(type) {
    switch (type) {
      case Callout.NOTE:
        return "info";
      case Callout.TIP:
        return "light-bulb";
      case Callout.IMPORTANT:
        return "report";
      case Callout.WARNING:
        return "alert";
      case Callout.CAUTION:
        return "stop";
      default:
        return null;
    }
  }
}

// Remark plugin to transform blockquotes with callout directives
// (e.g., [!NOTE]) into styled HTML elements.
export default function remarkCallouts() {
  return (tree) => {
    // Traverse the Markdown AST and find blockquote nodes
    visit(tree, "blockquote", (node, index, parent) => {
      // Check for the callout pattern in the first line of the blockquote
      const cell = node.children[0]?.children?.[0];
      const regx = cell?.value?.trim().match(/^\[!(\w+)\]/s);
      if (!regx) return;

      // Extract callout type (e.g., note, tip, warning)
      cell.value = cell.value.slice(regx[0].length);
      const type = regx[1];

      // Replace blockquote with a div representing the callout
      parent.children.splice(
        index,
        1,
        u(
          "containerDirective",
          {
            data: {
              hName: "div",
              hProperties: {
                className: `callout callout-${type.toLowerCase()}`,
              },
            },
          },
          [
            // Add the title as a normal paragraph with a specific class
            u(
              "paragraph",
              {
                data: {
                  hProperties: { className: `callout-title` },
                },
              },
              [
                u("html", octicons[Callout.toIcon(type)].toSVG()),
                {
                  type: "text",
                  value: type.toTitleCase(),
                },
              ],
            ),
            // Add each line of content as a separate paragraph
            ...node.children.filter((node) => node.children[0]?.value),
          ],
        ),
      );
    });
  };
}
