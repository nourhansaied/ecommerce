import { creat, find, findById,findByIdAndUpdate } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";
import { paginate } from "../../../services/pagination.js";

export const addCategory = asyncHandler(async (req, res, next) => {

  if (!req.file) {
    next(new Error("you have to upload an image", { cause: 422 }));
  } else {
    let { name } = req.body;
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: "category",
    });
     

    const result = await creat({ model: categoryModel,
      data: { name, image: secure_url, createdBy: req.user._id, publicImageId: public_id }});
    res.status(201).json({ message: "created", result });
  }
});



export const updateCategory = asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  let { name } = req.body;
  let category = await findById({model: categoryModel, id})
  if (!category) {
      next(new Error("category not found", {cause:404}))
  } else {
    let imgUrl = '';
    let publicImageId =""
      if (req.file) {
        let { secure_url,public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "category" });
        imgUrl = secure_url;
        publicImageId = public_id;
      } else {
        imgUrl = category.image
        publicImageId = category.public_id
      }
    let updatedCategory = await findByIdAndUpdate({model:categoryModel, condition:{ _id: id }, data:{ name, image: imgUrl,publicImageId },options:{new:true}});
    res.status(200).json({message:"updated",updatedCategory})
  }

})



export const categories = asyncHandler(async (req, res, next) => {
  let {limit,skip} = paginate(req.query.page, req.query.size);
  let allCategories = await find({ model: categoryModel, limit, skip });
  
  res.status(200).json({ message: "Done", allCategories });
})

export const getCategoryById = asyncHandler(async (req, res, next) => {
  let {categoryId} = req.params
  let category = await findById({ model: categoryModel, id: categoryId });
  if (!category) {
    next( new Error("invalid category", {cause:404}))
  } else {
      res.status(200).json({ message: "Done", category });

  }

});