import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../services/asyncHandler.js";
export const roles = {
    User: "User",
    Admin:"Admin"
}
export const auth = (acceptRoles = [roles.User]) => {

  return asyncHandler(async (req, res, next) => {
    // try {
    const { authorization } = req.headers;
    console.log({ authorization });
    if (!authorization?.startsWith(process.env.BearerKey)) {
      next(new Error("In-valid Bearer key", { cause: 400 }));
    } else {
      const token = authorization.split(process.env.BearerKey)[1];
      const decoded = jwt.verify(token, process.env.tokenSignature);
      console.log(decoded);
      if (!decoded?.id || !decoded?.isLoggedIn) {
        console.log("Asdsa");
        // res.status(400).json({ message: "In-valid token payload " })
        next(new Error("In-valid token payload", { cause: 400 }));
      } else {
        const user = await userModel.findById(decoded.id).select("email userName role");
        if (!user) {
          // res.status(404).json({ message: "Not register user" })
          next(new Error("Not register user", { cause: 404 }));
        } else {
            console.log(acceptRoles);
          if (acceptRoles.includes(user.role)) {
            req.user = user;
            next();
          } else {
            next(new Error("Not authorized user", { cause: 403 }));
          }
        }
      }
    }
    // } catch (error) {
    //     res.status(500).json({ message: "catch error", error })

    // }
  });
};
