import { execSync } from "node:child_process";

export default function remarkModifiedTime() {
  return (_, file) => {
    // Use git to check the last modified time for the current file
    const path = file.history[0];
    if (path === undefined)
      return;
    const date = Date.parse(
      execSync(`git log -1 --pretty="format:%cI" "${path}"`).toString(),
    );
    file.data.astro.frontmatter.modified = Number.isNaN(date)
      ? new Date()
      : new Date(date);
  };
}
