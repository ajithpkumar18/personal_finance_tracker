import mongoose, { models, Schema } from "mongoose";

const budgetSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: { type: String, enum: ["Food", "Rent", "Shopping"], required: true },
    month: { type: String, required: true },
    limit: { type: Number, required: true }
})

export default models.Budget || mongoose.model("Budget", budgetSchema);