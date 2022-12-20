import { roles } from "../../middleware/auth.js";



export const endPoints = {
    addCategory: [roles.User, roles.Admin],
    updateCategory:[roles.Admin]
}