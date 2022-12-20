import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "subCategory name is required"],
      min: [2, " subCategory name minimum length 2 char"],
      max: [20, " subCategory name max length 2 char"],
    },

    image: {
      type: String,
      required: [true, "subCategory image is required"],
    },
    public_id: {
      type: String,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "createBy  is required"],
    },

    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId  is required"],
    },
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = model("SubCategory", subCategorySchema);
export default subCategoryModel;



// /api/v1/category/:categoryId/subCategory