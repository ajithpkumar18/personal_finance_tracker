import { connectDB } from "@/app/lib/db";
import User from "@/app/lib/models/user";
import { emailSchema, passwordSchema } from "@/app/lib/zodSchema/authSchema";
import bcrypt from "bcrypt";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log("signup")
    const body = await req.json();
    const { email, password } = body;


    const passwordValidationResult = passwordSchema.safeParse(password);
    const emailValidationResult = emailSchema.safeParse(email);

    if (!passwordValidationResult.success || !emailValidationResult.success || !emailValidationResult.success) {
        return NextResponse.json(
            { message: "Enter valid input" },
            { status: 404 }
        );
    }

    try {
        await connectDB();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            NextResponse.json({ message: "Email or username already exists" }, { status: 400 });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword
        });


        const savedUser = await newUser.save();
        return NextResponse.json({ message: "User created successfully", user: { id: savedUser._id, username: savedUser.username, email: savedUser.email, role: savedUser.role } }, { status: 200 });
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ message: "Error creating user" }, { status: 500 });
    }
};
