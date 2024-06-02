import {
	ChangeEvent,
	FormEvent,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Loader2 } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type FormValuesType = { username: string; password: string; cpassword: string };
type FormValidityType = {
	username: boolean;
	usernameLength: boolean;
	password: boolean;
	passwordLength: boolean;
	passwordMatch: boolean;
};
export default function SignupWindow({
	setIsLoading,
	isLoading,
}: {
	setIsLoading: React.Dispatch<SetStateAction<boolean>>;
	isLoading: boolean;
}) {
	const [formValues, setFormValues] = useState<FormValuesType>({
		username: "",
		password: "",
		cpassword: "",
	});
	const [formVality, setFormVality] = useState<FormValidityType>({
		username: false,
		usernameLength: false,
		password: false,
		passwordLength: false,
		passwordMatch: false,
	});
	const validate = () => {
		const regex = /^[a-zA-Z0-9_-]+$/;
		const { username, password, cpassword } = formValues;
		const usernameLength = username.length;
		const passwordLength = password.length;

		setFormVality({
			username: regex.test(username),
			usernameLength: usernameLength >= 4 && usernameLength <= 13,
			password: regex.test(password),
			passwordLength: passwordLength >= 6 && passwordLength <= 15,
			passwordMatch: password === cpassword,
		});
	};
	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		validate();
		const { id, value } = e.target;
		setFormValues((prev) => ({ ...prev, [id]: value }));
	};
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		console.log("test");
		const formData = new FormData(e.currentTarget);
		const urlSearchParams = new URLSearchParams(formData as any);
		const response = await fetch(`${process.env.SERVER_URL}/auth/signup`, {
			method: "POST",
			mode: "cors",
			body: urlSearchParams,
			credentials: "include",
		});

		if (response.ok) {
			window.location.reload();
		} else {
			console.log();
			setIsLoading(false);
		}
	};

	useEffect(() => {
		validate();
	}, [formValues]);

	return (
		<>
			<CardContent>
				<form id="signup" method="POST" onSubmit={onSubmit}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								name="username"
								type="text"
								minLength={3}
								maxLength={13}
								onChange={handleChange}
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
								onChange={handleChange}
								required
							/>
						</div>
						<div className="flex flex-col space-y-2">
							<Label htmlFor="cpassword">Confirm Password</Label>
							<Input
								id="cpassword"
								name="cpassword"
								type="password"
								minLength={6}
								maxLength={32}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col gap-3">
				{isLoading ? (
					<Button className="w-full" form="signup" disabled>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Loading
					</Button>
				) : (
					<Button
						className="w-full"
						form="signup"
						disabled={
							Object.values(formVality).every((element) => element === true)
								? false
								: true
						}
					>
						Sign up
					</Button>
				)}
			</CardFooter>
		</>
	);
}
