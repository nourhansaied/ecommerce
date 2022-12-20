import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoints } from "./auth.endPoint.js";
import { signUpValidation, updateRoleValidation } from "./auth.validation.js";
import * as registerControl from './controller/registration.js'
const router = Router()

router.get("/", (req, res) => {
  res.status(200).json({ message: "Auth Module" });
});


router.post("/signup", registerControl.signUp);
router.get("/confirmEmail/:token", registerControl.confirmEmail);
router.post("/login", registerControl.logIn);
router.put("/updateRole", validation(updateRoleValidation), auth(endPoints.updateRole), registerControl.updateRole);




export default router;










