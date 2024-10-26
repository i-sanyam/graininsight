import { SignedIn } from "@clerk/clerk-react";
import ApiResponseHandler from "./components/ApiResponseHandler";
import Header from "./components/Header";
import grainInsightLogo from "./assets/grain-insight-logo.png";

export default function App() {
	return (
		<div>
			<div>
				<Header />
			</div>
			<div>
				<h1>Grain Insights Dashboard</h1>
				<img src={grainInsightLogo} alt="Grain Insights Logo" />
			</div>
			<div>
				<SignedIn>
					<ApiResponseHandler />
				</SignedIn>
			</div>
		</div>
	);
}
