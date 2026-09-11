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
  //UPDATE
    updatePost = async (req: Request, res: Response) => {
      try {
        // 1. VALIDASI PARAMS
        const validateParams = updatePostParamsSchema.parse(req.params);
        const { id } = validateParams;
  
        // 2. VALIDATE BODY
        const validateData = updatePostSchema.parse(req.body);
        const { title, content } = validateData;
  
        // 3. CEK POST
        const [existingPost] = await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.id, id));
  
        if (!existingPost) {
          return res.status(404).json({
            success: false,
            message: "post not found",
          });
        }
  
        // 4. SIAPKAN DATA UPDATE
        let imageUrl = existingPost.imageUrl;
        let imagePublicId = existingPost.imagePublicId;
  
        // 5.JIKA ADA IMAGE BARU
        if (req.file) {
          const uploadResult = await uploadToCloudinary(req.file.buffer);
          imageUrl = uploadResult.secure_url;
          imagePublicId = uploadResult.public_id;
  
          // HAPUS IMAGE LAMA
          if (existingPost.imagePublicId) {
            await deleteFromCloudinary(existingPost.imagePublicId);
          }
        }
  
        // 6.UPDATE DATABASE
        await db
          .update(postsTable)
          .set({
            ...(title !== undefined && {
              title,
            }),
  
            ...(content !== undefined && {
              content,
            }),
  
            ...(req.file && {
              imageUrl,
              imagePublicId,
            }),
          })
          .where(eq(postsTable.id, id));
  
        // 7.AMBIL DATA TERBARU
        const [updatePost] = await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.id, id));
  
        // 8. RESPONSE
        return res.status(200).json({
          success: true,
          message: "post updates successfully",
          data: {
            post: updatePost,
          },
        });
      } catch (error: any) {
        console.error("ipdate post error:", error);
        return res.status(500).json({
          success: false,
          message: "internal server error",
          error: error.message,
        });
      }
    };

}