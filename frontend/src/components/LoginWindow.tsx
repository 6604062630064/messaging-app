import { FormEvent, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const googleLoginURL =
	"https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=20206441792-j2m1g08lp5oi1r7kntc4h89ja5d0nhql.apps.googleusercontent.com&prompt=select_account&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile";

export default function LoginWindow({
	setIsLoading,
	isLoading,
}: {
	setIsLoading: React.Dispatch<SetStateAction<boolean>>;
	isLoading: boolean;
}) {
	const openLoginWindow = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const left = screen.width / 2 - 450 / 2;
		const top = screen.height / 2 - 600 / 2;
		const child = window.open(
			googleLoginURL,
			"name",
			`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=450, height=600, top=${top}, left=${left}`
		);

		const timer = setInterval(function () {
			if (child?.closed) {
				clearInterval(timer);
				window.location.reload();
			}
		}, 1000);
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		console.log("test");
		const formData = new FormData(e.currentTarget);
		const urlSearchParams = new URLSearchParams(formData as any);
		const response = await fetch(`${process.env.SERVER_URL}/auth/login`, {
			method: "POST",
			mode: "cors",
			body: urlSearchParams,
			credentials: "include",
		});

		if (response.ok) {
			window.location.reload();
		} else {
			const json = await response.json();
			console.log(json);
			setIsLoading(false);
		}
	};
	return (
		<>
			<CardContent>
				<form id="login" method="POST" onSubmit={onSubmit}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								name="username"
								type="text"
								minLength={3}
								maxLength={13}
								required
							/>
						</div>
						<div className="flex flex-col space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								minLength={6}
								maxLength={32}
								required
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col gap-3">
				{isLoading ? (
					<Button className="w-full" form="login" disabled>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Loading
					</Button>
				) : (
					<Button className="w-full" form="login">
						Sign in
					</Button>
				)}
				<Button className="w-full" onClick={openLoginWindow}>
					Sign in with Google
				</Button>
			</CardFooter>
		</>
	);
}
