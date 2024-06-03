import { getUserData } from "@/lib/utils";
import { cookies } from "next/headers";
import ProfileButton from "@/components/ProfileButton";
export default async function Header() {
	const token: string = cookies().get("token")?.value as string;
	const userData = await getUserData(token);
	return (
		<div className="sticky">
			<div className="max-w-screen-2xl w-full m-auto p-3 flex justify-between items-center">
				<h1 className="text-3xl font-bold">mChat</h1>
				<ProfileButton name={userData?.username}></ProfileButton>
			</div>
		</div>
	);
}
