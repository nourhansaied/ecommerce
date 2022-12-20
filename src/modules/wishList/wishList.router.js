import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./endPoints.js";
import * as wishListRouter from './controller/wishList.controler.js'
const router = Router({mergeParams:true});

router.get("/", (req, res) => {
  res.status(200).json({ message: "whishList Module" });
});


router.put("/", auth(endPoints.add), wishListRouter.addWishLis);
router.put("/remove", auth(endPoints.add), wishListRouter.removeWishList);


export default router;
