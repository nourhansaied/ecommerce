import { creat, findById, findByIdAndUpdate } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";

export const addSubCategory = asyncHandler(async (req, res, next) => {
    let {id} = req.params
  if (!req.file) {
    next(new Error("you have to upload an image", { cause: 422 }));
  } else {
    let { name } = req.body;
    let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: "category/subCategory",
    });

    const result = await creat(subCategoryModel, { name, image: secure_url, createdBy: req.user._id, public_id, categoryId: id});
    res.status(201).json({ message: "created", result });
  }
});

// export const updateSubCategory = asyncHandler(async (req, res, next) => {
//   let { subCategoryId } = req.params;
//   let { name } = req.body;
//   console.log(subCategoryId);
//   let subCategory = await findById({model:subCategoryModel, id:subCategoryId});
//   if (!subCategory) {
//     next(new Error("subCategory not found", { cause: 404 }));
//   } else {
//     let imgUrl = "";
//     if (req.file) {
//       let { secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: "category/subCategory" });
//       imgUrl = secure_url;
//     } else {
//       imgUrl = subCategory.image;
//     }
//     let updatedSubCategory = await findByIdAndUpdate({ model: subCategoryModel, condition: { _id: subCategoryId }, data: { name, image: imgUrl }, options: { new: true } });
//     res.status(200).json({ message: "updated", updatedSubCategory });
//   }
// });


export const updateSubCategory = asyncHandler(async (req, res, next) => {
  let { subCategoryId } = req.params;
    if (req.file) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "category/subCategory" });
      req.body.image = secure_url;
      req.body.public_id = public_id;
    }
  
  let results = await findByIdAndUpdate({ model: subCategoryModel, condition: { _id: subCategoryId }, data: req.body , options:{new:true}});
  if (!results) {
    await cloudinary.uploader.destroy(req.body.public_id)
    next(new Error("subCategrory not found", {cause:404}))
  } else {
    await cloudinary.uploader.destroy(results.public_id);
    res.status(200).json({ message: "updated", results });
      
  }

});



export const getSubCategory = asyncHandler(async (req, res, next) => {
  
  let { subCategoryId } = req.params;
console.log("asdasd");
  let data = await findById({ model: subCategoryModel, id: subCategoryId });
  if (!data) {  
    next( new Error("not found",{cause:404}))
  } else {
    const cursor = subCategoryModel.find().select("categoryId name").cursor();
    let allData = []
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
 // Prints documents one at a time
      let myObj = doc.toObject()
      let category = await categoryModel.findById(myObj.categoryId).select("name -_id");
      myObj.category = category;
      allData.push(
        myObj
      );
    }
    res.status(200).json({ message: "Done", allData });
  }
})