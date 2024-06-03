"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Friend({
	id,
	username,
	avatar,
}: {
	id: string;
	username: string;
	avatar: string;
}) {
	// const path = usePathname();
	return (
		<Link
			href={`/friends/${id}`}
			className="flex items-center p-3 hover:bg-[#4f4f66]"
		>
			<Avatar className="mr-2">
				<AvatarImage src={avatar} />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<h3>{username}</h3>
		</Link>
	);
}
