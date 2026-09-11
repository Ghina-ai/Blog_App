import { Request, Response } from "express";
import {
  createPostSchema,
  postIdSchema,
  updatePostParamsSchema,
  updatePostSchema,
} from "../../validation/posts.validation";
import { db } from "../../config/db";
import { categoriesTable, postsTable } from "../../config/schema";
import { and, eq, desc } from "drizzle-orm";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../servies/cloudinary.service";

export class PostsController {
  // GUEST ALL POST
    getPosts = async (req: Request, res: Response) => {
      try {
        const posts = await db
          .select({
            id: postsTable.id,
            title: postsTable.title,
            content: postsTable.content,
            imageUrl: postsTable.imageUrl,
            createdAt: postsTable.createdAt,
            categoryId: postsTable.categoryId,
            categoryName: categoriesTable.name,
          })
          .from(postsTable)
          .leftJoin(
            categoriesTable,
            eq(postsTable.categoryId, categoriesTable.id),
          )
          .where(eq(postsTable.status, "published"))
          .orderBy(desc(postsTable.createdAt));
  
        return res.status(200).json({
          success: true,
          message: "get posts successfully",
          data: {
            posts: posts,
          },
        });
      } catch (error: any) {
        console.error("get posts error:", error);
  
        return res.status(500).json({
          success: false,
          message: "internal server error",
          error: error.message,
        });
      }
    };

}