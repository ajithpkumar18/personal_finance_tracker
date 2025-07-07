import mongoose, { models, Schema } from "mongoose";

const expenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    amount: Number,
    category: String,
    date: Date,
    paymentMethod: String,
    notes: String
}, { timestamps: true })

export default models.Expense || mongoose.model("Expense", expenseSchema);
