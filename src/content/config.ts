import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    draft: z.boolean().optional(),
    description: z.string().optional(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const food = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/food" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    about: z.string(),
    link: z.string().optional(),
    info: z.object({
      yield: z.string().optional(),
      cook: z.string().optional(),
      prep: z.string().optional(),
      time: z.string().optional(),
    }),
    body: z.object({
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      nutrition: z.string().optional(),
      notes: z.string().optional(),
    }),
    tags: z.array(z.string()).optional(),
    star: z.boolean(),
  }),
});

const note = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog,
  food,
  note,
};
