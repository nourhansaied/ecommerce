import mongoose from 'mongoose'
const connectDB = async () => {
    console.log(process.env.DBURIONLINE);
    return await mongoose
      .connect(process.env.DBURIONLINE)
      .then((res) => console.log(`DB Connected successfully on .........${process.env.DBURIONLINE} `))
      .catch((err) => console.log(` Fail to connect  DB.........${err} `));
}


export default connectDB;