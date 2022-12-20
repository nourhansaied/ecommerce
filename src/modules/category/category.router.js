import { Router } from "express";
import { auth, roles } from "../../middleware/auth.js";
import { validationType, myMulter, HME } from "../../services/multer.js";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import { endPoints } from "./category.endPoint.js";
import * as categoryController from './controller/category.controller.js'
const router = Router()
// category/123123123/subcategory
router.use("/:id/subCategory", subcategoryRouter)
router.get("/", auth(endPoints.addCategory), categoryController.categories);
router.get("/:categoryId", auth(endPoints.addCategory), categoryController.getCategoryById);


router.post("/", auth(endPoints.addCategory), myMulter(validationType.image).single("image"), HME, categoryController.addCategory);
router.put("/:id", auth(endPoints.updateCategory), myMulter(validationType.image).single("image"), HME, categoryController.updateCategory);



export default router