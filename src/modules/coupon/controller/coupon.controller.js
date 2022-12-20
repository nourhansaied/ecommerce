import { creat, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";



export const addCoupon = asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user._id;
    let addded   = await creat({ model: couponModel, data: req.body });
    res.status(201).json({"message":"Added", addded})
})


export const updatedCoupon = asyncHandler(async (req, res, next) => {
    req.body.updatedBy = req.user._id;
    let {name} = req.params
  let updated = await findOneAndUpdate({model:couponModel,condition:{name}, data: req.body,options:{new:true}})
  res.status(200).json({ message: "updated", updated });
});


export const stopCoupon = asyncHandler(async (req, res, next) => {
  req.body.deletedBy = req.user._id;
    let { couponId } = req.params;
    console.log(couponId);
  let stopCouponStatus = await findOneAndUpdate({ model: couponModel, condition: { _id: couponId }, data: { isStopped: true, deletedBy: req.user._id }, options: { new: true } });
  res.status(200).json({ message: "stopCoupon", stopCouponStatus });
});