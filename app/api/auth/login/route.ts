import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/app/lib/models/user"
import { connectDB } from "@/app/lib/db";

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

const emailSchema = z.string().email('Invalid email address');

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    const passwordValidationResult = passwordSchema.safeParse(password);
    const emailValidationResult = emailSchema.safeParse(email);

    if (!passwordValidationResult.success || !emailValidationResult.success) {
        return NextResponse.json({ "message": "Invalid Input" }, { status: 400 });
    }

    try {
        await connectDB();
        const newUser = await User.findOne({ email });
        if (!newUser) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        if (!newUser.password) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
            return;
        }
        const isMatch = await bcrypt.compare(password, newUser.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        const response = NextResponse.json({ id: newUser._id, email: newUser.email, token: token }, { status: 200 })

        response.cookies.set("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60
        })

        return response;

    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error logging in" }, { status: 500 });
    }

}