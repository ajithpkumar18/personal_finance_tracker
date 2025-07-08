import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/db";
import Expense from "@/app/lib/models/Expense";
import Budget from "@/app/lib/models/Budget";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("userId");
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const expenses = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: monthStart, $lt: monthEnd }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const month = monthEnd.toISOString().slice(0, 7);
        console.log(expenses);

        const budgets = await Budget.find({ userId, month });

        const alerts = budgets.map(budget => {
            const spent = expenses.find(e => e._id === budget.category)?.total || 0;
            console.log(spent);

            const percent = (spent / budget.limit) * 100;

            let status = "ok";
            if (percent >= 100) status = "over";
            else if (percent >= 80) status = "warning";

            return {
                category: budget.category,
                spent,
                limit: budget.limit,
                percent: Number(percent.toFixed(2)),
                status
            };
        });

        return NextResponse.json(alerts, { status: 200 });
    } catch (err) {
        console.error("Budget alert error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
