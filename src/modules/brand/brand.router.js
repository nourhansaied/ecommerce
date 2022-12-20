import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { HME, myMulter, validationType } from "../../services/multer.js";
import { endPoints } from "./brand.endPoint.js";
import * as brandController from './controller/brand.controller.js'
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Brand Module"})
})

router.post("/", auth(endPoints.createBrand), myMulter(validationType.image).single("image"), HME, brandController.addBrand);
router.put("/:brandId", auth(endPoints.updateBrand), myMulter(validationType.image).single("image"), HME, brandController.updateBrand);



export default router