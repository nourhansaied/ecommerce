import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })
import express from 'express';
import morgan from "morgan";

import { initAPI } from "./src/modules/index.router.js";
import connectDB from './DB/connection.js'
import { globalError } from './src/services/asyncHandler.js'
const app = express()
// setup port and the baseUrl
const port = process.env.PORT || 5000
//convert Buffer Data

app.use(morgan("combined"));
  app.use(express.json());
app.use(express.urlencoded({extended:false}))
//Setup API Routing 

initAPI(app)

app.use(globalError)

connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


