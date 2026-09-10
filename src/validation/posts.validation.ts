import { z } from "zod";

export const createPostSchema = z.object({
    userId: z.coerce.number().int().positive(),

    title: z   
        .string()
        .min(3, "title mminimal 5 karakter")
        .max(225, "titlemaksimal 255 karakter"),

    content: z
        .string()
        .min(10, "content minimal10 karakter"),

    categoryId: z.coerce.number().int().positive(),

});

export const postIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

//validasi buat data user login
export const userIdSchema = z.object({
    userId: z.coerce.number().int().positive(),
});

export const userPostParamsSchema = z.object({
    userId: z.coerce.number().int().positive(),
    postId: z.coerce.number().int().positive(),
});

//UPDATE
export const updatePostParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const updatePostSchema = z.object({
    title: z   
        .string()
        .min(3, "title minimal 3 karakter")
        .max(225, "title maksimal 255 karakter")
        .optional(),

    content: z
        .string()
        .min(10, "content minimal 10 karakter")
        .optional(),
});