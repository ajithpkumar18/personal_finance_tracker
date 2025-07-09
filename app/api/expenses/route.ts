import { connectDB } from '@/app/lib/db';
import Expense from '@/app/lib/models/Expense';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    console.log("Get expenses")
    try {
        await connectDB();
        const userId = await req.headers.get("userId");
        console.log(userId)
        const expenses = await Expense.find({ userId: userId }).sort({ date: -1 });
        return NextResponse.json(expenses);
    } catch (err) {
        console.log("error")
        return NextResponse.json(err)
    }
}

export async function POST(req: NextRequest) {
    console.log("post")
    try {
        const body = await req.json();
        const { date, category, paymentMethod, notes, amount } = body;
        const inputDate = new Date(date);
        const userId = await req.headers.get("userId");
        console.log(userId);


        await connectDB();
        const saved = await Expense.create({
            amount,
            category,
            date: inputDate,
            paymentMethod,
            notes,
            userId
        });
        return NextResponse.json(saved, { status: 201 });
    }
    catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {

        const body = await req.json();
        const { expenseId, ...updatedFields } = body;
        const userId = await req.headers.get("userId");
        await connectDB();
        const updated = await Expense.findOneAndUpdate({ _id: expenseId, userId }, {
            ...updatedFields
        },
            { new: true }
        )

        if (!updated) {

            return NextResponse.json("Invalid userID", { status: 404 })
        }
        return NextResponse.json(updated, { status: 200 })

    } catch (err) {
        return NextResponse.json({ "error": err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { expenseId } = body;
        const userId = await req.headers.get("userId");
        await connectDB();

        const deleted = await Expense.findOneAndDelete({ _id: expenseId, userId });
        if (!deleted) {
            return NextResponse.json({ message: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Expense deleted", deleted });
    } catch (err) {
        return NextResponse.json({ message: "Failed to delete expense", err }, { status: 500 });
    }
}

