import Fetch from "@11ty/eleventy-fetch";

export default async function() {
  let data = {};

  for (const list of ["read", "live", "next"]) {
    let url = "https://api.zakhary.dev/books/read";

    data[list] = await Fetch(url, {
      duration: "1h",
      type: "json",
    });

    for (const item of data[list]) {
      item.date = new Date(item.date);
      item.year = item.date.getFullYear();
    }
  }

  return data;
}
