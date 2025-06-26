import { u } from "unist-builder";
import { visit } from "unist-util-visit";

export default function remarkSidenotes() {
  return (tree) => {
    visit(tree, "footnoteDefinition", (def) => {
      // Replace footnote references with sidenotes
      visit(tree, "footnoteReference", (ref, index, parent) => {
        // Only modify reference for this definition
        if (ref.identifier !== def.identifier) return;

        // Insert footnote reference
        parent.children.splice(
          index,
          1,
          u(
            "containerDirective",
            {
              data: {
                hName: "span",
                hProperties: {
                  className: "sidenote",
                },
              },
            },
            [
              u(
                "text",
                {
                  data: {
                    hName: "label",
                    hProperties: {
                      for: `sn-toggle-${def.identifier}`,
                    },
                  },
                },
                "",
              ),
              u(
                "text",
                {
                  data: {
                    hName: "input",
                    hProperties: {
                      id: `sn-toggle-${def.identifier}`,
                      type: "checkbox",
                    },
                  },
                },
                "",
              ),
              u(
                "containerDirective",
                {
                  data: { hName: "span" },
                },
                [
                  u(
                    "containerDirective",
                    {
                      data: { hName: "span" },
                    },
                    def.children?.[0]?.children,
                  ),
                ],
              ),
            ],
          ),
        );
      });
    });
  };
}
