import { Request, Response } from "express";
import {
  userIdSchema,
  userPostParamsSchema,
} from "../../validation/posts.validation";
import { postsTable } from "../../config/schema";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../../config/db";

export class UsersController {
  // AMBIL POSTINGANNYA BERDASARKAN ID USER
  getPostByUserId = async (req: Request, res: Response) => {
    try {
      const validateParams = userIdSchema.parse(req.params);
      const { userId } = validateParams;

      const post = await db
        .select()
        .from(postsTable)
        .where(
          and(
            eq(postsTable.userId, userId),
            eq(postsTable.status, "published"),
          ),
        )
        .orderBy(desc(postsTable.createdAt));

      return res.status(200).json({
        success: true,
        message: "post retrieved successfully",
        data: {
          post,
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

  // AMBIL POSTINGANNYA BBERDASARKAN ID POSTINGANNYA/satuan detailnya
  getUserPost = async (req: Request, res: Response) => {
    try {
      const validateParams = userPostParamsSchema.parse(req.params);
      const { userId, postId } = validateParams;

      const post = await db
        .select()
        .from(postsTable)
        .where(
          and(
            eq(postsTable.id, postId),
            eq(postsTable.userId, userId),
            eq(postsTable.status, "published"),
          ),
        );

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
          post,
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

export default new UsersController();
