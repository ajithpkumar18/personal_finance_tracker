import mongoose, { models, Schema } from "mongoose";

const expenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number },
    category: { type: String, enum: ["Food", "Rent", "Shopping"] },
    date: { type: Date },
    paymentMethod: { type: String, enum: ["UPI", "Credit Card", " Cash"] },
    notes: { type: String }
}, { timestamps: true })

export default models.Expense || mongoose.model("Expense", expenseSchema);
