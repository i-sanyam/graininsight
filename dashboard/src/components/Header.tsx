import React from "react";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";

const Header: React.FC = () => {
	return (
		// do styling by tailwind
		<header style={{ display: "flex", justifyContent: "flex-end" }}>
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
};

export default Header;
