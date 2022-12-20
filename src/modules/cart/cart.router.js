import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./cart.endPoint.js";
import * as cartController from './controller/cart.controller.js'
const router = Router()




router.post("/",auth(endPoints.create),cartController.createCart)




export default router