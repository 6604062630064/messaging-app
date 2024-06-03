import { getOnlineUsers } from "@/lib/utils";
import { cookies } from "next/headers";
import Friend from "@/components/Friend";
export default async function FriendListWindow() {
	const token: string = cookies().get("token")?.value as string;
	const onlineUsers = await getOnlineUsers(token);
	return (
		<div className="w-3/12 border-r-2">
			{onlineUsers?.map((element, i) => (
				<Friend {...element} key={i}></Friend>
			))}
		</div>
	);
}
