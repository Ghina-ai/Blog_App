import { Router } from "express";
import { uploadSingleImage } from "../../middleware/upload.middleware";
import postsController from "../../controller/posts/posts.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// CREATE
router.post('/' , authenticate, uploadSingleImage , postsController.createPosts);

// GET POST ALL
router.get('/' , postsController.getPosts);

// GET POST BY ID
router.get('/:id' , postsController.getPostById);

// UPDATE
router.patch('/:id' , authenticate, uploadSingleImage, postsController.updatePost);

// DELTE
router.delete('/:id' , authenticate, postsController.deletePost);


export default router;