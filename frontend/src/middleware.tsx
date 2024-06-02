import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;
	const token = req.cookies.get("token")?.value;

	if (!token) {
		if (pathname === "/") return NextResponse.next();
		return NextResponse.redirect(new URL("/", req.url));
	}
	let isAuthenticated = false;

	const response = await fetch(`${process.env.SERVER_URL}/auth/loggedin`, {
		method: "GET",
		credentials: "include",
		cache: "no-store",
		headers: {
			Cookie: `token=${token}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		isAuthenticated = true;
	}

	if (!isAuthenticated) {
		// will redirect to base page if not logged in
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (pathname === "/" && isAuthenticated) {
		// authenticated users are not allowed to vist login page
		return NextResponse.redirect(new URL("/friends", req.url));
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
