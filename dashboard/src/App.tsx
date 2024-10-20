import { SignedIn } from '@clerk/clerk-react';
import ApiResponseHandler from './components/ApiResponseHandler';
import Header from './components/Header';

export default function App() {
  return (
    <div>
      <Header />
      <h1>Grain Insight Dashboard</h1>
      <SignedIn>
        <ApiResponseHandler />
      </SignedIn>
    </div>
  );
}