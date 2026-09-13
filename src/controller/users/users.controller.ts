import { Request, Response } from "express";
import { userPostParamsSchema } from "../../validation/posts.validation";
import { userIdSchema, updateProfileSchema, createUserSchema } from "../../validation/users.validation";
import { postsTable, usersTable } from "../../config/schema";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../../config/db";
import { uploadToCloudinary, deleteFromCloudinary } from "../../servies/cloudinary.service";

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

  // CREATE USER / PROFILE
  createUser = async (req: Request, res: Response) => {
    try {
      // 1. VALIDASI DATA USER
      const validateData = createUserSchema.parse(req.body);

      const {
        username,
        email,
        bio,
      } = validateData;

      // 2. CEK EMAIL
      const existingUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: "email sudah digunakan",
        });
      }

       // 3. UPLOAD IMAGE
      let profileImage: string | undefined;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer
        );

        profileImage = uploadResult.secure_url;
      }

      // 3. INSERT USER
      const [insertedUser] = await db
        .insert(usersTable)
        .values({
          username,
          email,
          profileImage,
          bio,
        })
        .$returningId();

      // 4. AMBIL DATA USER YANG BARU
      const [newUser] = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
          profileImage: usersTable.profileImage,
          bio: usersTable.bio,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, insertedUser.id));

      // 5. RESPONSE
      return res.status(201).json({
        success: true,
        message: "user created successfully",
        data: {
          user: newUser,
        },
      });

    } catch (error: any) {
      console.error("create user error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };

  // AMBIL DATA PROFILE
  getProfile = async (req: Request, res: Response) => {
    try {
      const validateParams = userIdSchema.parse(req.params);
      const { userId } = validateParams;

      const [user] = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
          profileImage: usersTable.profileImage,
          bio: usersTable.bio,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "profile retrieved successfully",
        data: {
          profile: user,
        },
      });
    } catch (error: any) {
      console.error("get profile error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };

  // UPDATE PROFILE
  updateProfile = async (req: Request, res: Response) => {
    try {
      // 1. VALIDASI USER ID
      const validateParams = userIdSchema.parse(req.params);
      const { userId } = validateParams;

      // 2. VALIDASI DATA PROFILE
      const validateData = updateProfileSchema.parse(req.body);

      // 3. CEK PROFILE
      const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "profile not found",
        });
      }
      
      let profileImage = existingUser.profileImage;

      if (req.file) {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer
        );

        profileImage = uploadResult.secure_url;
      }


      // 4. UPDATE PROFILE
      await db
        .update(usersTable)
        .set({
          ...validateData,

          ...(req.file && {
          profileImage: profileImage,
        }),
      })
        .where(eq(usersTable.id, userId));

      // 5. AMBIL DATA TERBARU
      const [updatedUser] = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
          profileImage: usersTable.profileImage,
          bio: usersTable.bio,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      // 6. RESPONSE
      return res.status(200).json({
        success: true,
        message: "profile updated successfully",
        data: {
          profile: updatedUser,
        },
      });
    } catch (error: any) {
      console.error("update profile error:", error);

      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };

}

export default new UsersController();
