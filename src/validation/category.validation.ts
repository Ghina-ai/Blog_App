import { z } from "zod";

// CREATE CATEGORY
export const createCategorySchema = z.object({
  userId: z.coerce.number().int().positive(),
  name: z
    .string()
    .min(3, "nama category minimal 3 karakter")
    .max(100, "nama category maksimal 100 karakter"),
});

// CATEGORY ID
export const categoryIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive(),
});

// UPDATE CATEGORY
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, "nama category minimal 3 karakter")
    .max(100, "nama category maksimal 100 karakter"),
});