import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import  UsersController  from "../../controller/users/users.controller";

const router = Router();

//USER : GET ALL DATA(POSTS)
router.get('/:userId' , authenticate, UsersController.getPostByUserId);

//USER : GET DATA BY ID
router.get('/:userId/posts/:postId' , authenticate, UsersController.getUserPost);

export default router;