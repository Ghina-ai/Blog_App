import { z } from "zod";

// VALIDASI ID USER
export const userIdSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

// VALIDASI UPDATE PROFILE
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "username minimal 3 karakter")
    .max(50, "username maksimal 50 karakter")
    .optional(),

  email: z
    .string()
    .email("format email tidak valid")
    .max(100, "email maksimal 100 karakter")
    .optional(),

  bio: z
    .string()
    .max(500, "bio maksimal 500 karakter")
    .optional(),
});