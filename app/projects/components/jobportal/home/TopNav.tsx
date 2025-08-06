"use client";

import Link from "next/link";

import { useSession } from "@/app/(main)/SessionProvider";
import { logout } from "@/app/(auth)/actions";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function TopNav() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <>
      <nav className="nav justify-content-between shadow">
        <Link className="nav-link mt-2" href="/">
          Home
        </Link>
        <div className="d-flex align-items-center">
          <Link className="nav-link" href="/job-portal/companies">
            Companies
          </Link>
          <Link className="nav-link" href="/job-portal/candidates">
            Candidates
          </Link>
          <Link className="nav-link" href="/job-portal/jobs">
            Search jobs
          </Link>
          <Link className="nav-link" href="/job-portal/pricing">
            Pricing
          </Link>

          {user ? (
            <>
              {user?.rolejob === "CANDIDATE" ? (
                <Link className="nav-link" href={`/dashboard/job/candidate`}>
                  {user?.username}({user.rolejob})
                </Link>
              ) : (
                ""
              )}

              {user?.rolejob === "ADMIN" ? (
                <Link className="nav-link" href={`/dashboard/job/admin`}>
                  {user?.username}({user.rolejob})
                </Link>
              ) : (
                ""
              )}

              {user?.rolejob === "COMPANY" ? (
                <Link className="nav-link" href={`/dashboard/job/company`}>
                  {user?.username}({user.rolejob})
                </Link>
              ) : (
                ""
              )}

              <a
                className="nav-link pointer-job"
                onClick={() => {
                  queryClient.clear();
                  logout();
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="nav-link" href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
