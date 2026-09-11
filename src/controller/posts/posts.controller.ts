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

  // GUEST POST BY ID
    getPostById = async (req: Request, res: Response) => {
      try {
        const validateParams = postIdSchema.parse(req.params);
        const { id } = validateParams;
  
        const [post] = await db
          .select()
          .from(postsTable)
          .where(and(eq(postsTable.id, id), eq(postsTable.status, "published")));
  
        if (!post) {
          return res.status(404).json({
            success: false,
            message: "post not found",
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "post retrieved successfully",
          data: {
            post: post,
          },
        });
      } catch (error) {
        console.error("get posts error:", error);
        return res.status(500).json({
          success: false,
          message: "terjadi kesalahan pada server",
          error: error instanceof Error ? error.message : error,
        });
      }
    };
  

}