import { SessionData } from "../App";

interface StepProps {
  session: SessionData;
  isLoading: boolean;
  refreshSessionData: () => Promise<void>;
}

const Step4_CallAPI = ({ session, isLoading }: StepProps) => {
  const isDisabled = !session.accessToken;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${isDisabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            isDisabled ? "bg-gray-100" : "bg-purple-100"
          }`}
        >
          <span
            className={`font-semibold text-sm ${
              isDisabled ? "text-gray-400" : "text-purple-600"
            }`}
          >
            4
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Call Resource Application with Access Token
        </h2>
      </div>

      <div>
        {!isDisabled && (
          <>
            <p className="text-gray-600 mb-6">
              Use your Auth0 access token to make authenticated requests to the
              Resource Application's API endpoints.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-500 text-lg">💡</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Next Steps
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Include the access token in the Authorization header:{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          Bearer {session.accessToken?.substring(0, 20)}...
                        </code>
                      </li>
                      <li>
                        Make API calls to the Resource Application endpoints
                      </li>
                      <li>
                        The resource app will validate the token and authorize
                        your requests
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Example API Call:
              </h4>
              <pre className="text-xs text-gray-800 overflow-x-auto">
                {`curl -X GET "https://your-resource-app.com/api/protected" \\
  -H "Authorization: Bearer ${session.accessToken?.substring(0, 30)}..." \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600">🎉</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Cross App Access Flow Complete!
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    You have successfully completed the cross-app access token
                    flow. The Requesting Application is ready to access the
                    Resource Application's APIs.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Step4_CallAPI;
