
import { Schema, model,Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      min: [2, " Product name minimum length 2 char"],
      max: [20, " Product name max length 2 char"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "description  is required"],
      min: [2, " description  minimum length 2 char"],
      max: [200, " description  max length 2 char"],
    },

    images: {
      type: [String],
      required: [true, "Product images are required"],
    },
    publicImageIds: [String],
    stock: {
      type: Number,
      default: 0,
      required: [true, "stock images are required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    discount: {
      type: Number,
    },
    finalPrice: Number,

    colors: {
      type: [String]
    },
    sizes: {
      type: String,
      default: "free",
      enums: ["sm", "md", "lg", "xl", "free"],
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId  is required"],
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: [true, "subCategoryId  is required"],
    },
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand  is required"],
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "createBy  is required"],
    },
    updateBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    soldItems: Number,
    totalItems: Number,
  },
  {
    timestamps: true,
  }
);

const productModel = model("Product", productSchema);
export default productModel;
