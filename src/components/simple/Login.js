// login.jsx
import React from "react";
import { StytchLogin } from "@stytch/nextjs";

const Login = () => {
  const REDIRECT_URL =
    process.env.VERCEL_ENV === "preview" ? `https://${process.env.VERCEL_URL}/authenticate` : process.env.REDIRECT_URL || "http://localhost:3000/authenticate";

  const config = {
    products: ["emailMagicLinks"],
    emailMagicLinksOptions: {
      loginRedirectURL: `${REDIRECT_URL}`,
      loginExpirationMinutes: 180,
      signupRedirectURL: `${REDIRECT_URL}`,
      signupExpirationMinutes: 180,
    },
  };
  const styles = {
    container: {
      backgroundColor: "#FFFFFF",
      borderColor: "#FFFFFF",
      borderRadius: "8px",
      width: "400px",
    },
    colors: {
      primary: "#19303D",
      secondary: "#5C727D",
      success: "#0C5A56",
      error: "#8B1214",
    },
    buttons: {
      primary: {
        backgroundColor: "#245D00",
        textColor: "#FFFFFF",
        borderColor: "#245D00",
        borderRadius: "4px",
      },
      secondary: {
        backgroundColor: "#FFFFFF",
        textColor: "#19303D",
        borderColor: "#19303D",
        borderRadius: "4px",
      },
    },
    fontFamily: "Inter",
    hideHeaderText: false,
    logo: {
      logoImageUrl: "Logo-Design-Full-Color-Black.svg",
    },
  };
  return <StytchLogin config={config} styles={styles} />;
};

export default Login;
