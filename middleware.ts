import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;

    console.log("Running middleware");

    if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("userId", payload.id as string);

        console.log("Going to next")
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error("JWT error:", error);
        return new NextResponse("Unauthorized", { status: 401 });
    }
}

export const config = {
    matcher: ["/api/expenses/:path*", "/api/budget/:path*"],
};
