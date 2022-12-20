import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/email.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import { findById, findByIdAndUpdate, findOne } from "../../../../DB/DBMethods.js";
export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await findOne({model: userModel, condition: { email }, select: "email"});
  if (user) {
    // res.status(409).json({ messa`e: "this email already register" });
    return next(new Error("this email already register", { cause: 409 }));
  } else {
    let hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    let addUser = new userModel({ userName, email, password: hashedPassword });
    let token = jwt.sign({ id: addUser._id, isLoggedIn: true }, process.env.emailToken, { expiresIn: "1h" });
    let refreshToken = jwt.sign({ id: addUser._id, isLoggedIn: true }, process.env.emailToken, { expiresIn: 60 * 60 * 24 });

    let link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
    let refreshLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshToken/${refreshToken}`;

    let message = `please verfy your email <a href="${link}" >here </a>
        <br />
        to refresh token please click <a href="${refreshLink}" >here </a>
        `;
    let emailRes = await sendEmail(email, "confirm to register", message);
    if (emailRes.accepted.length) {
      let savedUser = await addUser.save();
     return  res.status(201).json({ message: "Added successfully", savedUser });
    } else {
     return next(new Error("invalid email", { cause: 404 }));
    }
  }
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  let { token } = req.params;
  let decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded && !decoded.id) {
    return next(new Error("invalid token data", { cause: 400 }));
  } else {
    let updatedUser = await findOneAndUpdate({model:userModel , condition: { _id: decoded.id, confirmEmail: false },data: { confirmEmail: true }, options:{ new: true }});

    if (updatedUser) {
     return res.redirect("http://localhost:4200/login");
    } else {
     return  next(new Error("invalid token data", { cause: 400 }));    }
  }
});

export const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({model:userModel,condition: { email }});
  if (!user) {
    return next(new Error("you have to register first", { cause: 404 }));
  } else {
    let matched = bcrypt.compareSync(password, user.password, parseInt(process.env.SALTROUND));
    if (matched) {
      if (!user.confirmEmail) {
       return  next(new Error("you have to confirm email first", { cause: 400 }));
      } else {
        let token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature, { expiresIn: 60 * 60 * 24 * 2 });
       return res.status(200).json({ message: "welcome", token });
      }
    } else {
      return next(new Error("in valid password", { cause: 400 }));
    }
  }
});



export const updateRole = asyncHandler( async (req, res, next) => {
  let { userId } = req.body;
  let user = await findById({ model: userModel, id :userId });
  if (!user) {
      return next(new Error("invalid user id", { cause: 404 }));
  } else {
    if (!user.confirmEmail) {
     return  next(new Error("please confirm your email first", { cause: 400 }));
    } else {
      let updatedUser = await findByIdAndUpdate({model: userModel, condition: { _id: user._id }, data: { role: 'Admin' },  options:{ new: true }})
       return  res.status(200).json({ message: "updated", updatedUser });
      }
  }
})