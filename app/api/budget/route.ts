import { connectDB } from "@/app/lib/db";
import Budget from "@/app/lib/models/Budget";
import Expense from "@/app/lib/models/Expense";
import User from "@/app/lib/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("userId");
        connectDB();
        if (!userId) {
            return NextResponse.json({ message: "Missing userId in headers" }, { status: 400 });
        }
        const AllExpenses = await Expense.find({ userId });
        return NextResponse.json(AllExpenses, { status: 200 })
    }
    catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await req.headers.get("userId");
        const { category, limit, month } = await req.json();
        console.log(month);
        const user = await User.findById(userId);

        if (!user) return NextResponse.json("No user Found", { status: 404 });

        const ExistingBudget = await Budget.findOne({ userId, category, month });

        if (ExistingBudget) {
            ExistingBudget.limit = limit;
            await ExistingBudget.save();

            return NextResponse.json({ message: "Budget updated", budget: ExistingBudget });
        }

        const budget = await Budget.create({ userId, category, limit, month })

        return NextResponse.json({ message: "Budget set", budget }, { status: 200 });
    } catch (err) {
        console.log(err);

        return NextResponse.json({ message: "Server error", err: err }, { status: 500 });
    }
}