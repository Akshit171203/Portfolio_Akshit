import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About — Akshit",
  description: "Full Stack Web Developer at CoRover. Experience, skills and how I think about building reliable web applications.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutPage />;
}
