import mongoose, { Schema } from "mongoose";
import { required, string } from "zod/v4-mini";

const budgetSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: { type: string, required: true },
    monthlyLimit: { type: Number, required: true }
})

module.exports = mongoose.model("Budget", budgetSchema);