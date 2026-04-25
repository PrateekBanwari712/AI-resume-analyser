import React from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/peuter";

const Navbar = () => {
  const { auth } = usePuterStore();

  const userName = auth?.user?.username.slice(0, 1).toUpperCase();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">ResumeIQ</p>
      </Link>

      {auth && (
        <div 
        onClick={auth.signOut}
        className="primary-button w-fit flex gap-2 cursor-pointer ">
          <span className="text-lg"> {userName}</span>
          <img src="/icons/logout.svg" alt="" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
