import { Metadata } from "next";
import JobForm from "./JobForm";

export const metadata: Metadata = {
  title: "Post a new job",
};

export default function Page() {
  return <JobForm />;
}