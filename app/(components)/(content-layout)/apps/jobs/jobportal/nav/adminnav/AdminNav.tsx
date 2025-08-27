"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  console.log(pathname);
  console.log(pathname === "/dashboard/job/job/admin");

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
    import(
      "bootstrap-material-design/dist/css/bootstrap-material-design.min.css"
    );
  }, []);

  return (
    <>
      <nav className="nav justify-content-center m-3">
        <Link
          style={{
            color: pathname === "/dashboard/job/admin" ? "white" : "black",
            fontWeight: pathname === "/dashboard/job/admin" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin" ? "green" : "transparent",
            // Add any additional styles for the active state here
          }}
          className="nav-link"
          href="/dashboard/job/admin"
        >
          Admin
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/industry" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/industry" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/industry"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          className="nav-link"
          href="/dashboard/job/admin/industry"
        >
          Create industry
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/organization"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/organization"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/organization"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          className="nav-link"
          href="/dashboard/job/admin/organization"
        >
          Add Organization
        </Link>

        <Link
          style={{
            color: pathname === "/dashboard/job/admin/team" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/team" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/team"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          className="nav-link"
          href="/dashboard/job/admin/team"
        >
          Team size
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/country" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/country" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/country"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          className="nav-link"
          href="/dashboard/job/admin/country"
        >
          Add Country
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/state" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/state" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/state"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          className="nav-link"
          href="/dashboard/job/admin/state"
        >
          Add State
        </Link>

        <Link
          style={{
            color: pathname === "/dashboard/job/admin/city" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/city" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/city"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/city"
          className="nav-link"
        >
          Add City
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/language" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/language" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/language"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/language"
          className="nav-link"
        >
          Add Language
        </Link>
        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/skill" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/skill" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/skill"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/skill"
          className="nav-link"
        >
          Add Skill
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/profession"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/profession"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/profession"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/profession"
          className="nav-link"
        >
          Add Profession
        </Link>
      </nav>

      <nav className="nav justify-content-center m-3">
        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/pricing" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/pricing" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/pricing"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/pricing"
          className="nav-link"
        >
          Add Pricing
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/paymentsettings"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/paymentsettings"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/paymentsettings"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/paymentsettings"
          className="nav-link"
        >
          Payment Settings
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/sitesettings"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/sitesettings"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/sitesettings"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/sitesettings"
          className="nav-link"
        >
          Site Settings
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/orders" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/orders" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/orders"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/orders"
          className="nav-link"
        >
          Orders
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/jobcategories"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/jobcategories"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/jobcategories"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/jobcategories"
          className="nav-link"
        >
          Job_categories
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/education" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/education" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/education"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/education"
          className="nav-link"
        >
          education
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/jobtype" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/jobtype" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/jobtype"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/jobtype"
          className="nav-link"
        >
          Jobtype
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/salarytype"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/salarytype"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/salarytype"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/salarytype"
          className="nav-link"
        >
          Salarytype
        </Link>

        <Link
          style={{
            color: pathname === "/dashboard/job/admin/tag" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/tag" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/tag" ? "green" : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/tag"
          className="nav-link"
        >
          tag
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/jobrole" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/jobrole" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/jobrole"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/jobrole"
          className="nav-link"
        >
          job role
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/jobexperience"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/jobexperience"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/jobexperience"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/jobexperience"
          className="nav-link"
        >
          job experience
        </Link>

        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/jobs/create"
                ? "white"
                : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/jobs/create"
                ? "bold"
                : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/jobs/create"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/jobs/create"
          className="nav-link"
        >
          Job Create
        </Link>
      </nav>

      <nav className="nav justify-content-center m-3">
        <Link
          style={{
            color:
              pathname === "/dashboard/job/admin/alljobs" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/alljobs" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/alljobs"
                ? "green"
                : "transparent",
            // Add any additional styles for the active state here
          }}
          href="/dashboard/job/admin/alljobs"
          className="nav-link"
        >
          alljobs
        </Link>

        {/* Admin Links */}
        <Link
          className="nav-link"
          style={{
            color: pathname === "/dashboard/job/admin/blog" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/blog" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/blog"
                ? "green"
                : "transparent",
          }}
          href="/dashboard/job/admin/blog"
        >
          Add blog
        </Link>

        <Link
          className="nav-link"
          style={{
            color:
              pathname === "/dashboard/job/admin/blogs" ? "white" : "black",
            fontWeight:
              pathname === "/dashboard/job/admin/blogs" ? "bold" : "normal",
            backgroundColor:
              pathname === "/dashboard/job/admin/blogs"
                ? "green"
                : "transparent",
          }}
          href="/dashboard/job/admin/blogs"
        >
          blogs
        </Link>
      </nav>
    </>
  );
}
