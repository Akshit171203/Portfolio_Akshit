import type { Metadata } from "next";
import { WorkList } from "@/components/pages/WorkList";

export const metadata: Metadata = {
  title: "Work — Akshit",
  description: "Selected projects: FollowUpHub, CoRover.ai, BuilderV2 and more. React, Next.js, TypeScript, Node.js, PostgreSQL and AI-powered applications.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <WorkList />;
}
