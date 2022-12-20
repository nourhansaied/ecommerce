import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "createBy  is required"],
      unique: true,
    },
    products: {
      type: [
        {
          productId: {
            type: Types.ObjectId,
            ref: "Product",
            required: [true, "Product  is required"],
          },
          quantity: {
            type: Number,
            default:1
          }
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = model("Cart", cartSchema);
export default cartModel;



// /api/v1/category/:categoryId/subCategory