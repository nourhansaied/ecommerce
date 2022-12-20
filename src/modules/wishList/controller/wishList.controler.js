import { findById, findByIdAndUpdate } from "../../../../DB/DBMethods.js";
import productModel from "../../../../DB/model/product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";

// removeWishList;

export const addWishLis = asyncHandler(async (req, res, next) => {
    let { productId } = req.params;
    let founded = await findById({ model: productModel, id: productId });
    if (!founded) {
      return   next(new Error("product not found", {cause: 404}))
    }
   let updated = await findByIdAndUpdate({
     model: userModel,
     condition: req.user._id,
     data: {
       $addToSet: { wishlist: productId },
     },
     options: { new: true },
   });
    
    res.status(200).json({message:"Done", updated})

}) 


export const removeWishList = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  let founded = await findById({ model: productModel, id: productId });
  if (!founded) {
    return next(new Error("product not found", { cause: 404 }));
  }
  let updated = await findByIdAndUpdate({
    model: userModel,
    condition: req.user._id,
    data: {
      $pull: { wishlist: productId },
    },
    options: { new: true },
  });

  res.status(200).json({ message: "Done", updated });
}); 