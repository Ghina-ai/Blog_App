import { z } from "zod";

//CREATE
export const createPostSchema = z.object({
    title: z   
        .string()
        .min(3, "title mminimal 5 karakter")
        .max(225, "titlemaksimal 255 karakter")
        .optional(),

    content: z
        .string()
        .min(10, "content minimal10 karakter")
        .optional(),

    categoryId: z.coerce.number().int().positive(),

});

//POST ID
export const postIdSchema = z.object({
    id: z.coerce.number().int().positive(),
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