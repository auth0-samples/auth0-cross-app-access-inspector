# Auth0 Cross App Access Inspector

The Auth0 Cross App Access (XAA) Inspector is a sample Node/React implementation of a Requesting Application
performing the Cross App Access flow to obtain an access token from a Resource Application which uses
Auth0 as its Authorization Server.

This implements the [Identity Assertion Authorization Grant](https://www.ietf.org/archive/id/draft-ietf-oauth-identity-assertion-authz-grant-00.html) protocol.

For more information, see the [Auth0 documentation](https://auth0.com/docs/xaa-resource-app).


> This sample app is a tool to test the Cross App Access end-to-end flow. Support of this flow is currently implemented by Auth0 as part of a private Beta program. To participate in this program, contact [Auth0 Support](http://support.auth0.com/) or your Technical Account Manager.

## Overview

This application shows the steps required to perform the Cross App Access flow from a Requesting Application:

1. Authenticate with the user's Enterprise IDP (Okta) to obtain an ID Token.
2. Exchange the ID Token at the Enterprise IDP (Okta) for an ID-JAG assertion using the [RFC 8693 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693) protocol.
3. Exchange the ID-JAG assertion at the Resource Application Authorization Server (Auth0) for an Auth0 access token using the [JWT-Bearer grant](https://datatracker.ietf.org/doc/html/rfc7523).
4. Use the Auth0 access token to call the Resource Application API.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Okta developer account
- Auth0 developer account

## Security Considerations

⚠️ **Important**: This application is for demonstration purposes only. In production, you should not expose
sensitive tokens like ID-JAG assertions to the frontend. Instead, keep them on the server side and use secure session storage.

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd auth0-cross-app-access-inspector
npm install
```

### 2. Configure the Resource Application

Follow the [Auth0 documentation](https://auth0.com/docs/xaa-resource-app) to set up your Resource Application in Auth0, making sure to:

- Create an API to represent your Resource Application.
- Create a Resource Application.
- Register the Resource Application in Okta. For a quick test set up, we recommend to use the Todo0 application that is already registered in the OIN. In your Okta tenant, go to Applications > Applications > Browse App Catalog > Search for “Todo0”. Select it and add the integration.

### 3. Configure the Requesting Application

Follow the [Auth0 documentation](https://auth0.com/docs/xaa-resource-app) to set up your Requesting Application, making sure to:

- Create an application in your Auth0 tenant to represent the XAA Inspector, and enable Cross App Access for the application.
- Register the Requesting Application in Okta. For a quick test set up, we recommend to use the Agent0 application that is already registered in the OIN. In your Okta tenant, go to Applications > Applications > Browse App Catalog > Search for “Agent0”. Select it and add the integration.
- In the `Sign On` tab of your registration in Okta, configure the `Redirect URI` to `http://localhost:3000/login/callback`.

### 4. Configure the Okta Identity Provider
Follow the [Auth0 documentation](https://auth0.com/docs/xaa-resource-app) to set up your Okta Identity Provider in Auth0, making sure to:
- Create an Okta Workforce connection in your Auth0 tenant.

### 5. Environment Configuration

Copy the `.env.sample` file to a new `.env` file in the root directory, and update the placeholder values:

- `SESSION_SECRET`: A long, random string for session encryption.
- `OKTA_ISSUER`: The issuer URL for your Okta tenant (e.g., `https://your-domain.okta.com`).
- `OKTA_CLIENT_ID`, `OKTA_CLIENT_SECRET`: the credentials of your Requesting App instance in your Okta tenant (found under the "Sign On" tab of your Okta application).
- `AUTH0_DOMAIN`: Your Auth0 tenant domain (e.g., `your-domain.auth0.com`).
- `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`: the credentials of your Requesting App instance in your Auth0 tenant (found under the "Settings" tab of your Auth0 application).
- `AUTH0_AUDIENCE`: The audience identifier for the Resource Application API in Auth0.
- `AUTH0_SCOPE`: The scopes required for the access token.


### 6. Run the Application

```bash
npm run dev
```

This starts the development at `http://localhost:3000`


## LICENSE

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for more details.