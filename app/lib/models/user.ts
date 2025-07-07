import mongoose, { models, Schema } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean
})

export default models.User || mongoose.model("User", userSchema);