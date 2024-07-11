import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@linkedinclone.0ug1f2q.mongodb.net/?retryWrites=true&w=majority&appName=linkedInClone`


if(!connectionString){
    throw new Error("please provide valid connection string");
}

const connectDB = async()=>{
    if(mongoose.connection?.readyState >=1){
        console.log("--already connected to mongoose");
        return
    }

    try{
        console.log("--connecting to mongodb---");
        await mongoose.connect(connectionString)
    }catch(error){
        console.log('Error connecting to mongo db ',error)
    }
}