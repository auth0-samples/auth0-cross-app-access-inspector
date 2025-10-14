import { useState } from "react";
import { SessionData } from "../App";
import { truncateToken } from "../utils";
import { CopyButton } from "./CopyButton";
import { JsonViewer } from "./JsonViewer";
import { HttpRequestViewer } from "./HttpRequestViewer";

interface StepProps {
  sessionData: SessionData;
  refreshSessionData: () => Promise<void>;
}

const Step2_TokenExchange = ({
  sessionData,
  refreshSessionData,
}: StepProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJwtDetails, setShowJwtDetails] = useState(false);

  const handleExchange = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/okta-token-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(JSON.stringify(errorData, null, 2));
      } else {
        await refreshSessionData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !sessionData.idToken;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${isDisabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            isDisabled ? "bg-gray-100" : "bg-orange-100"
          }`}
        >
          <span
            className={`font-semibold ${isDisabled ? "text-gray-400" : "text-orange-600"}`}
          >
            2
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Obtain ID-JAG Assertion
        </h2>
      </div>

      <p className="text-gray-600 mb-6">
        Exchange the ID Token at the Enterprise IDP for an ID-JAG Assertion.
      </p>

      {sessionData.oktaClientId && sessionData.idToken && (
        <div className="mb-6">
          <HttpRequestViewer
            content={`POST ${sessionData.oktaIssuer}/oauth2/v1/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange&
client_id=${sessionData.oktaClientId}&
client_secret=[REDACTED]&
subject_token=${sessionData.idToken ? truncateToken(sessionData.idToken) : "[ID_TOKEN]"}&
subject_token_type=urn:ietf:params:oauth:token-type:id_token&
requested_token_type=urn:ietf:params:oauth:token-type:id-jag&
audience=https://${sessionData.auth0Domain}/${
              sessionData.auth0Audience
                ? `&
resource=${sessionData.auth0Audience}`
                : ""
            }`}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleExchange}
        disabled={isDisabled || loading}
        className={`font-medium py-2 px-4 rounded-md transition duration-200 ${
          isDisabled || loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-orange-600 hover:bg-orange-700 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Exchanging...
          </span>
        ) : (
          "Exchange ID Token"
        )}
      </button>

      {sessionData.idJagAssertion && (
        <div className="mt-6">
          <div className="flex items-center text-green-600 mb-4">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">ID-JAG Assertion received!</span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  ID-JAG Assertion (JWT):
                </label>
                <CopyButton text={sessionData.idJagAssertion} />
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono break-all whitespace-pre-wrap">
                {truncateToken(sessionData.idJagAssertion)}
              </pre>
            </div>

            {(sessionData.idJagAssertionHeader ||
              sessionData.idJagAssertionClaims) && (
              <div>
                <button
                  onClick={() => setShowJwtDetails(!showJwtDetails)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showJwtDetails ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Hide ID-JAG Details
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Show ID-JAG Details
                    </>
                  )}
                </button>

                {showJwtDetails && (
                  <div className="mt-4 space-y-4">
                    {sessionData.idJagAssertionHeader && (
                      <JsonViewer
                        data={sessionData.idJagAssertionHeader}
                        title="JWT Header"
                      />
                    )}

                    {sessionData.idJagAssertionClaims && (
                      <JsonViewer
                        data={sessionData.idJagAssertionClaims}
                        title="JWT Claims (Payload)"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2_TokenExchange;
