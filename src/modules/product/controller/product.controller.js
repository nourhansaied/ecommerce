import slugify from "slugify";
import { creat, find, findById, findByIdAndUpdate, findOne } from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/brand.model.js";
import categoryModel from "../../../../DB/model/category.model.js";
import productModel from "../../../../DB/model/product.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import { asyncHandler } from "../../../services/asyncHandler.js";
import cloudinary from "../../../services/cloudinary.js";
import { paginate } from "../../../services/pagination.js";


export const addProduct = asyncHandler(async(req, res, next) => {
    let { categoryId, subCategoryId, brandId } = req.params;
    let foundedSubCategory = await findOne({ model: subCategoryModel, condition: { _id: subCategoryId, categoryId } });
    if (!foundedSubCategory) {
        next(new Error("SubCategory or category  id not found", { cause: 404 }));
    } else {
        let brand = await findById({ model: brandModel, id: brandId });
        if (!brand) {
                    next(new Error("brand  id not found", { cause: 404 }));
        } else {

            if (!req.files?.length) {
                next(new Error("you have to ad some images", {cause:400}))
            } else {
              let { name, discount, price } = req.body;
              req.body.slug = slugify(name);
              req.body.stock = req.body.totalItems;
              req.body.finalPrice = price - (price * discount || 0) / 100;
              // if (discount) {
              //     req.body.finalPrice = discount > price ? 1 : price -discount
              // }
              req.body.categoryId = categoryId;
              req.body.subCategoryId = subCategoryId;
              req.body.brandId = brandId;
              req.body.createdBy = req.user._id;
                req.body.soldItems = 0;
                
                let imagesURL = [];
                let imageIds = [];
                for (const file of req.files) {
                    let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "brands/products" });
                    imagesURL.push(secure_url)
                    imageIds.push(public_id);

                }
                req.body.images = imagesURL;
                req.body.publicImageIds = imageIds;

                let product = await creat({model:productModel,data:req.body})
                if (!product) {
                    for (const id of imageIds) {
                        await cloudinary.uploader.destroy(id)
                    }
                    next(new Error("error when isert to DB", {cause:400}))
                } else {
                    res.status(201).json({message:"Created",product})
                }

            }


            
        }
    }


})




export const updateProduct = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  let product = await findById({ model: productModel, id: productId });
  if (!product) {
    next(new Error("product  id not found", { cause: 404 }));
  } else {
      let {price,discount,name,totalItems} = req.body
      if (name) {
        req.body.slug = slugify(name);
      }
      if (price && discount) {
          req.body.finalPrice = price - (price * discount ) / 100;
      } else if (price) {
          req.body.finalPrice = price - (price * product.discount) / 100;
      } else if (discount) {
        req.body.finalPrice = product.price - (product.price * discount) / 100;
      }
      if (totalItems) {
          let currentStock = totalItems - product.soldItems;
          req.body.stock = currentStock > 0 ? currentStock : 0
      }

      if (req.files?.length) {
        let imagesURL = [];
        let imageIds = [];
        for (const file of req.files) {
        let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "brands/products" });
        imagesURL.push(secure_url);
        imageIds.push(public_id);
        }
        req.body.images = imagesURL;
        req.body.publicImageIds = imageIds;
      }
      req.body.updateBy= req.user._id

      let updatedProduct = await findByIdAndUpdate({
          model: productModel,
          condition: { _id: productId },
          data: req.body,
          options:{new:true}
      });
      if (!updatedProduct) {
          if (req.body.publicImageIds) {
              for (const id of req.body.publicImageIds) {
                  await cloudinary.uploader.destroy(id)
              }
          }
          next( new Error("DB error", {cause:400}))
      } else {

       if (req.body.publicImageIds) {
         for (const id of product.publicImageIds) {
           await cloudinary.uploader.destroy(id);
         }
       }
          
          res.status(200).json({message:"updated"})
      }

  }
});

const populate = [
  {
    path: "categoryId",
  },
  {
    path: "createdBy",
    select: "userName",
  },
  {
    path: "subCategoryId",
  },
  {
    path: "brandId",
  },
];

export const productLis = asyncHandler(async (req, res, next) => {
    let { limit, skip } = paginate(req.query.page, req.query.size);
    let products = await find({ model: productModel, skip, limit, populate:[...populate] })
    res.status(200).json({message:"Done",products})
})
// let x = 20;


// let message = x > 15 ? " hi" : "bye"

// if (x > 15) {
//     message = "hi"
// } else {
//     message = "bye"
// }



// price => finalPrice = price - (price * DBDiscount)
// discount => finalPrice = BDPrice - (BDPrice * discount)
// price & discount => finalPrice = price - (price * discount)



// 40  => 140