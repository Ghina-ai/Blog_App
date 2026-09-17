import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import postsController from "../../controller/posts/posts.controller";

const router = Router();

// CREATE
router.post("/", uploadSingleImage, postsController.createPosts);

// GET POST ALL
router.get("/", postsController.getPosts);

// GET POST BY ID
router.get("/:id", postsController.getPostById);

// UPDATE
router.patch(
  "/:id",
  uploadSingleImage,
  postsController.updatePost,
);

// DELTE
router.delete("/:id", postsController.deletePost);

export default router;
