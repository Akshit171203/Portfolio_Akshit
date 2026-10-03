import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact — Akshit",
  description: "Hiring, building a product, or want to talk engineering and AI? Get in touch.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <ContactPage />;
}
