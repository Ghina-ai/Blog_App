import { Router } from "express";
import  UsersController  from "../../controller/users/users.controller";

const router = Router();

//GET PROFILE
router.get('/:userId/profile', UsersController.getProfile);

// UPDATE PROFILE
router.patch("/:userId/profile", UsersController.updateProfile);

//GET DATA BY ID
router.get('/:userId/posts/:postId', UsersController.getUserPost);

export default router;