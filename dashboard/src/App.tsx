import { SignedIn } from "@clerk/clerk-react";
import ApiResponseHandler from "./components/ApiResponseHandler";
import Header from "./components/Header";
import grainScanLogo from "./assets/grain-scan-logo.png";
import grainSample1 from "./assets/sample-inputs/1509/Image00002.jpg"
import grainSample2 from "./assets/sample-inputs/1509/Image00003.jpg"
import { GitHubLogoIcon } from "@radix-ui/react-icons";

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
				</SignedIn>
			</div>
			<div>
				<p>
					Grain Scan Dashboard is a web application that allows users to upload images of grain samples for analysis.
					The application uses machine learning models to predict the quality of the grain samples based on the images.
					Users can upload images of grain samples and view the predicted quality of the samples.
				</p>
				<div style={{display: "flex"}}>
					<GitHubLogoIcon/>
					<a target="_blank" href="https://github.com/i-sanyam/graininsight">Github Source Code</a>
				</div>
				<a target="_blank" href="https:sanyamaggarwal.com">Sanyam Aggarwal</a>
				<SampleScansContainer />
			</div>
		</div>
	);
}
