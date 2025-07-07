import { connectDB } from "@/app/lib/db";
import Expense from "@/app/lib/models/Expense";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("userId");
        if (!userId) {
            return NextResponse.json({ message: "Unauthirized" }, { status: 401 })
        }

        await connectDB();

        const { searchParams } = req.nextUrl;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const category = searchParams.get("category");
        const paymentMethod = searchParams.get("paymentMethod");
        const searchText = searchParams.get("q");

        const filter: any = { userId };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate).toISOString();
            if (endDate) filter.date.$lte = new Date(endDate).toISOString();
        }

        if (category) filter.category = category;

        if (paymentMethod) filter.paymentMethod = paymentMethod;

        if (searchText) filter.notes = { $regex: searchText, $options: "i" }
        console.log(filter)
        const expenses = await Expense.find(filter).sort({ date: -1 });

        return NextResponse.json(expenses, { status: 200 })
    }
    catch (err) {
        console.log(err);
        return;
    }
    return;
}