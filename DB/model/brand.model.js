import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      min: [2, " Brand name minimum length 2 char"],
      max: [20, " Brand name max length 2 char"],
      trim: true,
    },
    slug:String,
    image: {
      type: String,
      required: [true, "Brand image is required"],
    },
    public_id: {
      type: String,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "createBy  is required"],
    },
  },
  {
    timestamps: true,
  }
);

const brandModel = model("Brand", brandSchema);
export default brandModel;



// /api/v1/category/:categoryId/subCategory