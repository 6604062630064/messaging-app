import FriendListWindow from "@/components/FriendListWindow";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<FriendListWindow></FriendListWindow>
			{children}
		</>
	);
}
