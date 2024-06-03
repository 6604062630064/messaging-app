import { Contact, Users } from "lucide-react";
import Link from "next/link";
export default function Sidebar() {
	return (
		<div className="flex flex-col w-2/12 text-xl h-full border-r-2">
			<Link
				href="/friends"
				className="hover:bg-[#4f4f66] flex items-center py-4 px-3"
			>
				<Contact className="mr-2" /> Friends
			</Link>
			<Link
				href="/channels"
				className="hover:bg-[#4f4f66] flex items-center py-4 px-3"
			>
				<Users className="mr-2" />
				Channels
			</Link>
		</div>
	);
}
