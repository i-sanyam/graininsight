import * as React from "react";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export interface InputProps 
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Header = React.forwardRef<HTMLInputElement, InputProps>(
	({ className }, ref) => {
	return (
		<header className={cn(className)} ref={ref}>
			<SignedOut>
				<SignInButton>
					<Button>Sign In</Button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</header>
	);
});

export default Header;
