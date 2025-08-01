import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export default function remarkReadingTime() {
  return (tree, { data }) => {
    // Convert the document tree to a string, and calculate the reading time
    const text = toString(tree);
    const read = getReadingTime(text);
    // Note: `readingTime.text` will give us minutes read as a friendly string,
    //       i.e. "3 min read"
    data.astro.frontmatter.readingTime = read;
  };
}
