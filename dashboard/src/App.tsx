import { SignedIn } from "@clerk/clerk-react";
import ApiResponseHandler from "./components/ApiResponseHandler";
import Header from "./components/Header";
import grainScanLogo from "./assets/grain-scan-logo.png";

export default function App() {
	return (
		<div>
			<div>
				<Header />
			</div>
			<div>
				<img height="256px" width="256px" src={grainScanLogo} alt="Grain Scan Logo" />
				<h1>Grain Scan Dashboard</h1>
			</div>
			<div>
				<SignedIn>
					<ApiResponseHandler />
				</SignedIn>
			</div>
		</div>
	);
}
