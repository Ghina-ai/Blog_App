import { Router } from "express";
import categoryController from "../../controller/category/category.controller";

const router = Router();

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getCategories);

router.patch("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

export default router;