import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { HME, myMulter, validationType } from "../../services/multer.js";
import { endPoints } from "./product.endPoint.js";
import * as productController from './controller/product.controller.js';
import wishList from '../wishList/wishList.router.js'
const router = Router()


router.use("/:productId/wishlist", wishList);

router.get('/', productController.productLis)



router.post("/:categoryId/:subCategoryId/:brandId",
    auth(endPoints.create),
    myMulter(validationType.image).array("image", 7),
    HME,
    productController.addProduct);


router.put("/:productId", auth(endPoints.create), myMulter(validationType.image).array("image", 7), HME, productController.updateProduct);

export default router