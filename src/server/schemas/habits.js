import "server-only";
import { z } from "zod";

const categories = [
  "Health",
  "Fitness",
  "Learning",
  "Productivity",
  "Mindfulness",
];

const types = ["boolean", "streak", "quantity"];

// preprocess keeps express-validator semantics: every check runs even when the
// value is missing, so a missing required field yields both the "required" and
// the format/length message in the errors array (same as express-validator).
export const HabitSchemas = {
  create: z.object({
    title: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Habit title is required")
        .min(3, "Habit title must be at least 3 characters long"),
    ),
    description: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Description is required")
        .min(3, "Description must be at least 3 characters long"),
    ),
    category: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Category is required")
        .refine((value) => categories.includes(value), "Invalid category"),
    ),
    frequency: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Frequency is required")
        .refine(
          (value) => value === "daily" || value === "weekly",
          "Frequency must be 'daily' or 'weekly'",
        ),
    ),
    color: z.any().optional(),
    type: z.any().optional(),
    unit: z.any().optional(),
  }),

  update: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Habit title must be at least 3 characters long")
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, "Description must be at least 3 characters long")
      .optional(),
    category: z
      .string()
      .refine((value) => categories.includes(value), "Invalid category")
      .optional(),
    frequency: z
      .string()
      .trim()
      .refine(
        (value) => value === "daily" || value === "weekly",
        "Frequency must be 'daily' or 'weekly'",
      )
      .optional(),
    color: z
      .string()
      .trim()
      .min(4, "Color must be a valid hex color")
      .max(7, "Color must be a valid hex color")
      .optional(),
    type: z
      .string()
      .refine((value) => types.includes(value), "Invalid habit type")
      .optional(),
    unit: z.any().optional(),
  }),
};
