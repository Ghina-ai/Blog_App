import { Router } from "express";
import  UsersController  from "../../controller/users/users.controller";

const router = Router();

//USER : GET ALL DATA(POSTS)
router.get('/:userId', UsersController.getPostByUserId);

//USER : GET DATA BY ID
router.get('/:userId/posts/:postId', UsersController.getUserPost);

export default router;