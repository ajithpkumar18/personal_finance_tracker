import mongoose, { models, Schema } from "mongoose";
import { required, string } from "zod/v4-mini";

const budgetSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: { type: string, enum: ["Food", "Rent", "Shopping"], required: true },
    month: { type: String, required: true },
    limit: { type: Number, required: true }
})

export default models.Budget || mongoose.model("Budget", budgetSchema);