import { SignedIn } from "@clerk/clerk-react";
import ApiResponseHandler from "./components/ApiResponseHandler";
import Header from "./components/Header";
import grainScanLogo from "./assets/grain-scan-logo.png";
import grainSample1 from "./assets/sample-inputs/1509/Image00002.jpg"
import grainSample2 from "./assets/sample-inputs/1509/Image00003.jpg"

function SampleScansContainer() {
	return (
		<div>
			1509 Samples for Scan
			<div className="image-container" style={{ display: "flex", gap: "16px" }}>
				<a target="_blank" href={grainSample1}>
					<img height="256px" width="256px" src={grainSample1} alt="Grain Scan Sample 1" />
				</a>
				<a target="_blank" href={grainSample2}>
					<img height="256px" width="256px" src={grainSample2} alt="Grain Scan Sample 2" />
				</a>
			</div>
		</div>
	)
};

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
					<SampleScansContainer />
				</SignedIn>
			</div>
		</div>
	);
}
