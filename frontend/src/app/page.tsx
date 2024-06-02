import { cookies } from "next/headers";
import LoginPage from "@/components/pages/LoginPage";
type LoginStatusTypes = {
	username: string;
	role: string;
	avatar: string;
} | null;
type TokenTypes = { name: string; value: string } | undefined;
const getLoginStatus: (token: TokenTypes) => Promise<LoginStatusTypes> = async (
	token
) => {
	if (!token) {
		// returns null if token does not exist
		return null;
	}
	const { name, value } = token;
	const response = await fetch(`${process.env.SERVER_URL}/auth/loggedin`, {
		method: "GET",
		credentials: "include",
		cache: "no-store",
		headers: {
			Cookie: `${name}=${value}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return null;
	}
};

export default async function Home() {
	const cookieStore = cookies();
	const token: TokenTypes =
		cookieStore.get("token") || cookieStore.get("google_token");

	const loginStatus: LoginStatusTypes = await getLoginStatus(token);
	if (loginStatus) {
		return <main>mainpage</main>;
	} else {
		return <LoginPage></LoginPage>;
	}
}
