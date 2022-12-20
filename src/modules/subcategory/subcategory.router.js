import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { HME, myMulter, validationType } from "../../services/multer.js";
import * as subCategoryController from './controller/subCategory.controller.js'
import { endPoints } from "./subcategory.endPoint.js";
const router = Router({mergeParams:true})




router.post("/", auth(endPoints.addSubCategory),myMulter(validationType.image).single("image"), HME, subCategoryController.addSubCategory);


router.put("/:subCategoryId", auth(endPoints.addSubCategory), myMulter(validationType.image).single("image"), HME, subCategoryController.updateSubCategory);

router.get("/:subCategoryId", auth(endPoints.getSubCategory), subCategoryController.getSubCategory);

export default router