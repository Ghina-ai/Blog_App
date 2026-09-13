import { Request, Response } from "express";
import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";
import { eq } from "drizzle-orm";

import {
  createCategorySchema,
  categoryIdSchema,
  updateCategorySchema,
} from "../../validation/category.validation";

class CategoryController {

  createCategory = async (req: Request, res: Response) => {
    try {
      const validateData = createCategorySchema.parse(req.body);
      const { name } = validateData;

      const [existingCategory] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.name, name));

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "category already exists",
        });
      }

      const [insertedCategory] = await db
        .insert(categoriesTable)
        .values({ name })
        .$returningId();

      return res.status(201).json({
        success: true,
        message: "category created successfully",
        data: {
          category: {
            id: insertedCategory.id,
            name,
          },
        },
      });

    } catch (error: any) {
      console.error("create category error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };


  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await db
        .select()
        .from(categoriesTable);

      return res.status(200).json({
        success: true,
        message: "get categories successfully",
        data: {
          categories,
        },
      });

    } catch (error: any) {
      console.error("get categories error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };


  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = categoryIdSchema.parse(req.params);
      const { name } = updateCategorySchema.parse(req.body);

      const [existingCategory] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, id));

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "category not found",
        });
      }

      await db
        .update(categoriesTable)
        .set({ name })
        .where(eq(categoriesTable.id, id));

      return res.status(200).json({
        success: true,
        message: "category updated successfully",
      });

    } catch (error: any) {
      console.error("update category error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };


  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = categoryIdSchema.parse(req.params);

      const [existingCategory] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, id));

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "category not found",
        });
      }

      await db
        .delete(categoriesTable)
        .where(eq(categoriesTable.id, id));

      return res.status(200).json({
        success: true,
        message: "category deleted successfully",
      });

    } catch (error: any) {
      console.error("delete category error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };
}

export default new CategoryController();