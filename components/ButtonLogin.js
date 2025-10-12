import Link from "next/link";

// This is a component that renders a login button or a welcome back message
const ButtonLogin = ({ isLoggedIn, name, extraStyle }) => {
  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className={`btn btn-primary + ${extraStyle ? extraStyle : ""}`}
      >
        Welcome back {name}
      </Link>
    );
  }

  return <button className="btn btn-primary">Login</button>;
};

export default ButtonLogin;
