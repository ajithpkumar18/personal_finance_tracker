import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtVerify } from "jose";


export async function middleware(req: NextRequest) {
    const token = await req.cookies.get('access_token')?.value;
    console.log("This is the middleware")
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        console.log(payload)
        const requestHeaders = new Headers(req.headers);
        console.log(payload.id)

        requestHeaders.set("userId", payload.id as string)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    }
    catch (error) {
        console.log(error);

        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

}

export const config = {
    matcher: ["/api/expenses/:path*"]
}