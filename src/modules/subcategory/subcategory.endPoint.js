import { roles } from "../../middleware/auth.js";



export const endPoints = {
  addSubCategory: [roles.Admin],
  getSubCategory: [roles.Admin,roles.User]
};