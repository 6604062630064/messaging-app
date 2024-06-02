"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginWindow from "../LoginWindow";
import SignupWindow from "../SignupWindow";
export default function LoginPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoginWindow, setIsLoginWindow] = useState<boolean>(true);

	return (
		<div className="flex justify-center">
			<Card className="mt-48 max-w-[450px] w-full ">
				<CardHeader className="flex flex-row justify-between">
					<div>
						<CardTitle className="text-4xl font-extrabold">mChat</CardTitle>
						<CardDescription>Let&apos;s join us</CardDescription>
					</div>
					<Button
						variant="outline"
						className="w-24"
						onClick={() => setIsLoginWindow((prev) => !prev)}
					>
						{isLoginWindow ? "Sign up" : "Sign in"}
					</Button>
				</CardHeader>
				{isLoginWindow ? (
					<motion.div
						key={"login"}
						initial={{ x: -15, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ ease: "easeInOut", duration: 0.4 }}
						exit={{ x: 15, opacity: 0 }}
					>
						<LoginWindow
							setIsLoading={setIsLoading}
							isLoading={isLoading}
						></LoginWindow>
					</motion.div>
				) : (
					<motion.div
						key={"signup"}
						initial={{ x: -15, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ ease: "easeInOut", duration: 0.4 }}
					>
						<SignupWindow
							setIsLoading={setIsLoading}
							isLoading={isLoading}
						></SignupWindow>
					</motion.div>
				)}
			</Card>
		</div>
	);
}
