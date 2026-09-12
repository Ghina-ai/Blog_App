import { Router } from "express";
import categoriesController from "../../controller/categorys/category.controller";

const router = Router();

router.post("/", categoriesController.createCategory);

export default router;