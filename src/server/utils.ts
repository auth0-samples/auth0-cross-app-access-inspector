import {decodeJwt} from "jose";

export const decodeJwtSafely = (token: string) => {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const decodeJwtHeader = (token: string) => {
  try {
    const headerPart = token.split(".")[0];
    const decoded = Buffer.from(headerPart, "base64url").toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode JWT header:", error);
    return null;
  }
};
