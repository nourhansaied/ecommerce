import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./coupon.endPoint.js";
import * as couponController from './controller/coupon.controller.js'
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Coupon Module"})
})


router.post("/", auth(endPoint.create), couponController.addCoupon);
router.put("/:name", auth(endPoint.create), couponController.updatedCoupon);
router.put("/remove/:couponId", auth(endPoint.create), couponController.stopCoupon);




export default router