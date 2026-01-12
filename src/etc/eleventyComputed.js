import { execSync } from "child_process";

export default {
  created: data => data.created ? new Date(data.created) : undefined,
  updated: data => data.updated ? new Date(data.updated) : undefined,
  modified(data) {
    // Only for rendered URLs
    if (!data.page.url) {
      return undefined;
    }
    // Default to 11ty date
    let date = data.page.date;
    try {
      date = new Date(
        parseInt(
          execSync(
            // Formats https://www.git-scm.com/docs/git-log#_pretty_formats
            // %at author date, UNIX timestamp
            `git log -1 --format=%at ${data.page.inputPath}`,
            { stdio: ["pipe", "pipe", "ignore"] },
          )
        ) * 1000
      );
    } finally {
      return date;
    }
  }
};
