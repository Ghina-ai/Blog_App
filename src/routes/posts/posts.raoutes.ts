import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import PostsController from "../../controller/posts/posts.controller";

const router = Router();

// CREATE
router.post("/", uploadSingleImage, PostsController.createPosts);

// GET POST ALL
router.get("/", PostsController.getPosts);

// GET POST BY ID
router.get("/:id", PostsController.getPostById);

// UPDATE
router.patch(
  "/:id",
  uploadSingleImage,
  PostsController.updatePost,
);

// DELTE
router.delete("/:id", PostsController.deletePost);

export default router;
