import { SessionData } from "../App";
import { truncateToken } from "../utils";
import { CopyButton } from "./CopyButton";

interface StepProps {
  session: SessionData;
  isLoading: boolean;
  refreshSessionData: () => Promise<void>;
}

const Step1_SignIn = ({ session, isLoading }: StepProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold">1</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Authenticate with Enterprise IDP
          </h2>
        </div>

        {!isLoading && session.isAuthenticated && (
          <a
            href="/logout"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </a>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Redirect the user to their enterprise IDP (Okta) to get an ID Token.
      </p>

      {isLoading && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      )}

      {!isLoading && !session.isAuthenticated && (
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Sign In with Okta
        </a>
      )}

      {!isLoading && session.isAuthenticated && (
        <div className="space-y-4">
          <div className="flex items-center text-green-600">
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
            <span className="font-medium">
              Signed in as: {session.user?.username}
            </span>
          </div>

          {session.idToken && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  ID Token:
                </label>
                <CopyButton text={session.idToken} />
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono break-all whitespace-pre-wrap">
                {truncateToken(session.idToken)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step1_SignIn;
