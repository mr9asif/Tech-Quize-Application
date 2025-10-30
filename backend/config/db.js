import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect(`mongodb+srv://quize-app:UR1d7a8LMLUEaHiy@cluster0.p7hqbnv.mongodb.net/?appName=Cluster0`)
    .then(()=>console.log("DB connected!!"))
}