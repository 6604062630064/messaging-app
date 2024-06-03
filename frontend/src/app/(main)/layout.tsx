import Header from "@/components/Header";
import { cookies } from "next/headers";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const token: string | undefined = cookies().get("token")?.value;
	return (
		<div className="flex flex-col h-full">
			<Header></Header>
			{children}
		</div>
	);
}
