import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    amount: Number,
    category: String,
    date: Date,
    paymentMethod: String,
    notes: String
}, { timestamps: true })

module.exports = mongoose.model("Expense", expenseSchema);
