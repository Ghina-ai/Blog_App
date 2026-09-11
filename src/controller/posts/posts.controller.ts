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
  //DELETE
    deletePost = async (req: Request, res: Response) => {
      try {
        // 1. VALIDATE POST ID
        const validateParams = postIdSchema.parse(req.params);
        const { id } = validateParams;
  
        // 2.CEK POST
        const existingPost = await db.query.postsTable.findFirst({
          where: eq(postsTable.id, id),
        });
  
        if (!existingPost) {
          return res.status(404).json({
            success: false,
            message: "post not found",
          });
        }
  
        // 3. DELETE PERMANEN DARI DATABASE
        await db.delete(postsTable).where(eq(postsTable.id, id));
  
        // 4.RESPONSE
        return res.status(200).json({
          success: true,
          message: "post deleted successfully",
        });
      } catch (error: any) {
        console.error("delete post error:,", error);
        return res.status(500).json({
          success: false,
          message: "internal server error",
          error: error.message,
        });
      }
    };

}