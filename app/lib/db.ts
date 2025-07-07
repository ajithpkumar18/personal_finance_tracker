import mongoose from "mongoose";

let isConnected = false;

const uri = process.env.MONGO;
export async function connectDB() {
    if (isConnected) {
        return;
    }

    if (!uri) return;
    try {
        console.log("trying connection")
        await mongoose.connect(uri);

        isConnected = true;
        console.log("Connected to mongoDB");

    }
    catch (e) {
        console.log(e);
        return e;
    }
}