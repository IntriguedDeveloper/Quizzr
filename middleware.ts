// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/admin/home")) {
		// Get session token from cookie
		const sessionCookie = request.cookies.get("__Session");

		if (!sessionCookie?.value) {
			return NextResponse.redirect(new URL("/auth", request.url));
		}

		try {
			// Verify the session cookie
			const response = await fetch(
				`${request.nextUrl.origin}/api/auth/verify`,
				{
					headers: {
						Authorization: `Bearer ${sessionCookie.value}`,
					},
				}
			);

			if (!response.ok) {
				return NextResponse.redirect(
					new URL("/admin/auth/login", request.url)
				);
			}

			return NextResponse.next();
		} catch (error) {
			return NextResponse.redirect(new URL("/auth/", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
