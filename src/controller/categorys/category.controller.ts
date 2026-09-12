import { Request, Response } from "express";
import { createCategorySchema } from "../../validation/categorys.validation";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";

export class CategoriesController {
  createCategory = async (req: Request, res: Response) => {
    try {
      const validateData = createCategorySchema.parse(req.body);
      const { name } = validateData;

      const [insertedCategory] = await db
        .insert(categoriesTable)
        .values({
          name,
        })
        .$returningId();

      return res.status(201).json({
        success: true,
        message: "category created successfully",
        data: {
          categoryId: insertedCategory.id,
          name,
        },
      });
    } catch (error) {
      console.error("create category error:", error);

      return res.status(500).json({
        success: false,
        message: "terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new CategoriesController();
