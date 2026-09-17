import { Router } from "express";
import  UsersController  from "../../controller/users/users.controller";
import { uploadSingleImage } from "../../middleware/upload.middleware";

const router = Router();

// CREATE USER
router.post("/", uploadSingleImage, UsersController.createUser);

//GET PROFILE
router.get('/:userId/profile', UsersController.getProfile);

// UPDATE PROFILE
router.patch("/:userId/profile", uploadSingleImage, UsersController.updateProfile);

//GET DATA BY ID
router.get('/:userId/posts/:postId', UsersController.getUserPost);

// GET ALL POST BY USER
router.get("/:userId/posts", UsersController.getPostByUserId);

export default router;