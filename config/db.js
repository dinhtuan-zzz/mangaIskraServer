// import mongoose from "mongoose";
// export const connect = async () => {
//   try {
//     mongoose.connect(
//       "mongodb+srv://gentaro:flsforever@cluster0.h7fqhxn.mongodb.net/?retryWrites=true&w=majority"
//     );
//     console.log("Connected to database");
//   } catch (err) {
//     console.log(err);
//   }
// };
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const URI = process.env.DB_URI
export async function connect () {
    try {
     await mongoose.connect(URI, {useNewUrlParser: true,useUnifiedTopology: true});
     console.log('Connected to MongoDB');
    }
    catch (err) {
        console.log('err', err);
    }
 }