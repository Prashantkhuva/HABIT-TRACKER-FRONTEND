import "server-only";
import { z } from "zod";

const slug = z
  .string()
  .trim()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase with hyphens only",
  )
  .optional();

// preprocess keeps express-validator semantics: every check runs even when the
// value is missing, so a missing required field yields both the "required" and
// the length message in the errors array (same as express-validator).
export const BlogSchemas = {
  create: z.object({
    title: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters"),
    ),
    content: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Content is required")
        .min(10, "Content must be at least 10 characters"),
    ),
    slug,
    description: z.any().optional(),
    categories: z.any().optional(),
    readingTime: z.any().optional(),
    published: z.any().optional(),
    image: z.any().optional(),
    steps: z.any().optional(),
  }),

  update: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .optional(),
    content: z
      .string()
      .trim()
      .min(10, "Content must be at least 10 characters")
      .optional(),
    slug,
    description: z.any().optional(),
    categories: z.any().optional(),
    readingTime: z.any().optional(),
    published: z.any().optional(),
    image: z.any().optional(),
    steps: z.any().optional(),
  }),
};
