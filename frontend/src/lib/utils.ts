import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type UserDataType = { username: string; role: string; avatar: string };
type OnlineUsersType = { id: string; username: string; avatar: string }[];
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getUserData(token: string): Promise<UserDataType | null> {
	const response = await fetch(`${process.env.SERVER_URL}/auth/loggedin`, {
		method: "GET",
		cache: "no-store",
		mode: "cors",
		headers: {
			cookie: `token=${token}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return null;
	}
}

export async function getOnlineUsers(
	token: string
): Promise<OnlineUsersType | null> {
	const response = await fetch(`${process.env.SERVER_URL}/user`, {
		method: "GET",
		cache: "no-store",
		mode: "cors",
		headers: {
			cookie: `token=${token}`,
		},
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return null;
	}
}
