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
  // CREATE
  createPosts = async (req: Request, res: Response) => {
    try {
      const validateData = createPostSchema.parse(req.body);
      const { userId, title, content, categoryId } = validateData;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const [insertedPost] = await db
        .insert(postsTable)
        .values({
          userId,
          title,
          content,
          categoryId,
          imageUrl,
          imagePublicId,
        })
        .$returningId();

      const newPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, insertedPost.id),
      });

      return res.status(201).json({
        success: true,
        message: "post created successfully",
        data: {
          post: newPost,
        },
      });
    } catch (error) {
      console.error("create post error:", error);
      return res.status(500).json({
        success: false,
        message: "terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

}