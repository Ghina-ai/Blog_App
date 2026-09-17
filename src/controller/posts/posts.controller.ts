import { Request, Response } from "express";
import {
  createPostSchema,
  postIdSchema,
  updatePostParamsSchema,
  updatePostSchema,
} from "../../validation/posts.validation";
import { db } from "../../config/db";
import { categoriesTable, postsTable, usersTable } from "../../config/schema";
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
      const { title, content, categoryId } = validateData;
      const userId = 4;
      
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
        
        userId: postsTable.userId,
        username: usersTable.username,
        profileImage: usersTable.profileImage,

        })
        .from(postsTable)

        .leftJoin(
        categoriesTable,
        eq(postsTable.categoryId, categoriesTable.id),
        )

        .leftJoin(
        usersTable,
        eq(postsTable.userId, usersTable.id),
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

export default new PostsController();