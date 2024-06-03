import Sidebar from "@/components/Sidebar";
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div
				className="max-w-screen-2xl flex w-full m-auto border-2 flex-1 text-lg"
				id="remainder"
			>
				<Sidebar></Sidebar>
				{children}
			</div>
		</>
	);
}
