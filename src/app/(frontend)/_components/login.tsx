import Input from "./input";
import { SubmitButton } from "./submit-button";
import { useAuth } from "../_providers/auth";
import { useRouter } from "next/navigation";

enum LOGIN_VIEW {
	SIGN_IN = "sign-in",
	REGISTER = "register",
}

type Props = {
	setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
	const { login } = useAuth();
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries()) as {
			email: string;
			password: string;
		};
		await login(data);
		router.refresh()
	};

	return (
		<div
			className="max-w-sm w-full flex flex-col items-center"
			data-testid="login-page"
		>
			<h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
			<p className="text-center text-base-regular text-ui-fg-base mb-8">
				Sign in to access an enhanced shopping experience.
			</p>
			<form className="w-full" onSubmit={handleSubmit}>
				<div className="flex flex-col w-full gap-y-2">
					<Input
						label="Email"
						name="email"
						type="email"
						title="Enter a valid email address."
						autoComplete="email"
						required
						data-testid="email-input"
					/>
					<Input
						label="Password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						data-testid="password-input"
					/>
				</div>
				{/* <ErrorMessage error={message} data-testid="login-error-message" /> */}
				<SubmitButton data-testid="sign-in-button" className="w-full mt-6">
					Sign in
				</SubmitButton>
			</form>
			<span className="text-center text-ui-fg-base text-small-regular mt-6">
				Not a member?{" "}
				<button
					onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
					className="underline"
					data-testid="register-button"
				>
					Join us
				</button>
				.
			</span>
		</div>
	);
};

export default Login;
