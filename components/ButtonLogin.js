"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

// This is a component that renders a login button or a welcome back message
const ButtonLogin = ({ session, extraStyle }) => {
  const dashboardUrl = "/dashboard";

  if (session) {
    return (
      <Link
        href={dashboardUrl}
        className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
      >
        Welcome back {session.user.name || "friend"}
      </Link>
    );
  }

  return (
    <button
      className={`btn btn-primary ${extraStyle ? extraStyle : ""}`}
      onClick={() => {
        signIn(undefined, { callbackUrl: dashboardUrl });
      }}
    >
      Get started
    </button>
  );

  // 1. Create a /login page

  // 2. Create an email/password form

  // 3. Make a POST request to /api/auth
};

export default ButtonLogin;
