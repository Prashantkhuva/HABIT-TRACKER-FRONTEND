import "server-only";
import { z } from "zod";

// preprocess keeps express-validator semantics: every check runs even when the
// value is missing, so a missing required field yields both the "required" and
// the format/length message in the errors array (same as express-validator).
const email = z.preprocess(
  (value) => value ?? "",
  z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid"),
);

export const UserSchemas = {
  register: z.object({
    email,
    username: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Username is required")
        .min(3, "Username must be at least 3 characters long"),
    ),
    password: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .trim()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long"),
    ),
  }),

  login: z.object({
    email,
    password: z.preprocess(
      (value) => value ?? "",
      z.string().trim().min(1, "Password is required"),
    ),
    username: z.string().trim().optional(),
  }),

  changePassword: z.object({
    oldPassword: z.preprocess(
      (value) => value ?? "",
      z.string().min(1, "Old password is required"),
    ),
    newPassword: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .min(1, "New password is required")
        .min(6, "New password must be at least 6 characters long"),
    ),
  }),

  updateDetails: z
    .object({
      username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters long")
        .optional(),
      fullname: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters long")
        .optional(),
      email: z
        .string()
        .trim()
        .email("Email is invalid")
        .optional(),
    })
    .superRefine((value, ctx) => {
      if (!value.fullname && !value.email) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: "At least one field is required: fullname or email",
        });
      }
    }),

  forgotPassword: z.object({
    email,
  }),

  resetPassword: z.object({
    token: z.preprocess(
      (value) => value ?? "",
      z.string().min(1, "Reset token is required"),
    ),
    password: z.preprocess(
      (value) => value ?? "",
      z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long"),
    ),
  }),
};
