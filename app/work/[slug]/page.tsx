import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView } from "@/components/pages/ProjectView";
import { getNextProject, getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Akshi`,
    description: p.tagline,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: `${p.name} — Akshi`, description: p.tagline, url: `/work/${slug}` },
  };
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const p = getProject(slug);
  if (!p) notFound();
  return <ProjectView project={p} next={getNextProject(slug)} />;
}
