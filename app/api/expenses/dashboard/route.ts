import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/db";
import Expense from "@/app/lib/models/Expense";

export async function GET(req: NextRequest) {
    await connectDB();

    const userId = req.headers.get("userId");
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const expenses = await Expense.find({
        userId,
        date: { $gte: start },
    });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryWise: Record<string, number> = {};
    const methodCount: Record<string, number> = {};
    const trendMap: Record<string, number> = {};

    for (const e of expenses) {
        categoryWise[e.category] = (categoryWise[e.category] || 0) + (e.amount || 0);
        methodCount[e.paymentMethod] = (methodCount[e.paymentMethod] || 0) + 1;

        const label = new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        trendMap[label] = (trendMap[label] || 0) + e.amount;
    }

    const topCategory = Object.entries(categoryWise).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const topMethods = Object.entries(methodCount).sort((a, b) => b[1] - a[1]).map(([k]) => k);

    const trend = Object.entries(trendMap).map(([date, amount]) => ({ date, amount }));

    return NextResponse.json({ totalSpent, topCategory, topMethods, categoryWise, trend });
}
