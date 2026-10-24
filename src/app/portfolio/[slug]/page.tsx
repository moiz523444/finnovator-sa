import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/portfolio/CaseStudy";
import { getNextProject, getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Alif Landing Solutions`,
    description: project.summary,
  };
}

// params are URL data, so they're read inside a Suspense boundary (keeps the App Shell shared)
async function ProjectDetails({ params }: { params: PageProps<"/portfolio/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudy project={project} next={getNextProject(slug)} />;
}

export default function ProjectPage({ params }: PageProps<"/portfolio/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProjectDetails params={params} />
    </Suspense>
  );
}
