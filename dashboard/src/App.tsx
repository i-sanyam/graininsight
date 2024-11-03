import { SignedIn } from "@clerk/clerk-react";
import ApiResponseHandler from "./components/ApiResponseHandler";
import Header from "./components/Header";
import grainScanLogo from "./assets/white-grain-scan-logo.png";
import grainSample1 from "./assets/sample-inputs/1509/Image00002.jpg";
import grainSample2 from "./assets/sample-inputs/1509/Image00003.jpg";

function SampleScansContainer() {
    return (
        <div className="w-full">
            <h2 className="text-center mt-8">1509 Samples for Scan</h2>
            <div className="flex justify-center gap-4 mt-4">
                <a target="_blank" href={grainSample1}>
                    <img className="h-64 w-64" src={grainSample1} alt="Grain Scan Sample 1" />
                </a>
                <a target="_blank" href={grainSample2}>
                    <img className="h-64 w-64" src={grainSample2} alt="Grain Scan Sample 2" />
                </a>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <div className="min-h-screen flex flex-col items-center w-full">
            <Header className="relative absolute right-0 top-0" />
            <div>
                <img className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" src={grainScanLogo} alt="Grain Scan Logo" />
                <h1 className="text-gold-100 mt-4 text-3xl font-bold">Grain Scan Dashboard</h1>
            </div>
            <div className="mt-8 w-full flex justify-center">
                <SignedIn>
                    <div className="w-full">
                        <ApiResponseHandler />
                        <SampleScansContainer />
                    </div>
                </SignedIn>
            </div>
        </div>
    );
}