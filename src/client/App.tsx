import "./App.css";
import { useState, useEffect } from "react";
import Step1_SignIn from "./components/Step1_SignIn";
import Step2_TokenExchange from "./components/Step2_TokenExchange";
import Step3_GetAccessToken from "./components/Step3_GetAccessToken";
import Step4_CallAPI from "./components/Step4_CallAPI";
import { Header } from "./components/Header";

export interface SessionData {
  isAuthenticated: boolean;
  user?: {
    username?: string;
  };
  idToken?: string;
  idTokenClaims?: any;
  idJagAssertion?: string;
  idJagAssertionClaims?: any;
  idJagAssertionHeader?: any;
  accessToken?: string;
  accessTokenClaims?: any;
  accessTokenHeader?: any;
  oktaClientId?: string;
  oktaIssuer?: string;
  auth0Domain?: string;
  auth0Audience?: string;
  auth0ClientId?: string;
  auth0Scope?: string;
}

function App() {
  const [sessionData, setSessionData] = useState<SessionData>({
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSessionData = async () => {
    try {
      setError(null);
      const response = await fetch("/api/inspector-debug");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "Server returned non-JSON response. Please check server configuration.",
        );
      }

      const data = await response.json();
      console.log("Session data received:", data);
      setSessionData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch session data";
      console.error("Failed to fetch session data:", err);
      setError(errorMessage);
      setSessionData({ isAuthenticated: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSessionData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto min-h-[calc(100vh-4rem)]">
        <Header />

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Connection Error
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={refreshSessionData}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <Step1_SignIn
            session={sessionData}
            isLoading={loading}
            refreshSessionData={refreshSessionData}
          />
          <Step2_TokenExchange
            sessionData={sessionData}
            refreshSessionData={refreshSessionData}
          />
          <Step3_GetAccessToken
            sessionData={sessionData}
            refreshSessionData={refreshSessionData}
          />
          <Step4_CallAPI
            session={sessionData}
            isLoading={loading}
            refreshSessionData={refreshSessionData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
