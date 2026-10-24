import React from "react";
import Image from "next/image";
import type { ArtVariant, Project } from "@/data/projects";

/*
 * Generated cover art for a project: a gradient stage with a mock landing page shown on a
 * device. Everything is sized in container units (cqw) so it scales with the card.
 * If the project has a real `cover` image, that is shown instead.
 */

type Palette = Project["palette"];

function MiniSite({ p, mobile = false, title }: { p: Palette; mobile?: boolean; title: string }) {
  const line = (w: string, o = 0.25) => (
    <span className="block h-[0.9cqw] rounded-full" style={{ width: w, background: p.ink, opacity: o }} />
  );
  return (
    <div className="flex h-full w-full flex-col overflow-hidden" style={{ background: `linear-gradient(160deg, ${p.from}, ${p.to})` }}>
      {/* nav */}
      <div className="flex items-center justify-between px-[6%] py-[4%]">
        <span className="flex items-center gap-[0.8cqw]">
          <span className="block size-[2.2cqw] rounded-[0.6cqw]" style={{ background: p.accent }} />
          {line(mobile ? "5cqw" : "7cqw", 0.6)}
        </span>
        {mobile ? (
          <span className="flex flex-col gap-[0.6cqw]">
            {line("3.4cqw", 0.6)}
            {line("3.4cqw", 0.6)}
          </span>
        ) : (
          <span className="flex gap-[1.6cqw]">
            {line("4cqw", 0.35)}
            {line("4cqw", 0.35)}
            {line("4cqw", 0.35)}
          </span>
        )}
      </div>
      {/* hero */}
      <div className={`flex flex-1 flex-col ${mobile ? "items-start px-[8%] pt-[8%]" : "items-center px-[10%] pt-[3%] text-center"}`}>
        <span
          className="block font-medium leading-[0.95] tracking-[-0.05em]"
          style={{ color: p.ink, fontSize: mobile ? "4.6cqw" : "4.2cqw" }}
        >
          {title}
        </span>
        <span className={`mt-[2cqw] flex flex-col gap-[0.9cqw] ${mobile ? "" : "items-center"}`}>
          {line(mobile ? "26cqw" : "34cqw", 0.3)}
          {line(mobile ? "20cqw" : "26cqw", 0.3)}
        </span>
        <span className="mt-[2.6cqw] flex gap-[1cqw]">
          <span className="block h-[3.2cqw] w-[11cqw] rounded-full" style={{ background: p.accent }} />
          {!mobile && <span className="block h-[3.2cqw] w-[9cqw] rounded-full border" style={{ borderColor: p.ink, opacity: 0.35 }} />}
        </span>
        {/* product block */}
        <span
          className={`mt-auto block rounded-t-[1.4cqw] ${mobile ? "h-[38%] w-full" : "h-[38%] w-[78%]"}`}
          style={{ background: `linear-gradient(180deg, ${p.ink}26, ${p.ink}08)`, boxShadow: `inset 0 0 0 1px ${p.ink}22` }}
        />
      </div>
    </div>
  );
}

function Browser({ p, title }: { p: Palette; title: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 aspect-[16/10] w-[74%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.4cqw]" style={{ boxShadow: `0 0 0 1px ${p.ink}22, 0 4cqw 8cqw -2cqw rgb(0 0 0 / 0.45)` }}>
      <div className="flex h-[6%] items-center gap-[0.7cqw] px-[2%]" style={{ background: `${p.to}` }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="block size-[0.9cqw] rounded-full" style={{ background: p.ink, opacity: 0.25 }} />
        ))}
        <span className="mx-auto block h-[1.4cqw] w-[26%] rounded-full" style={{ background: p.ink, opacity: 0.12 }} />
      </div>
      <div className="h-[94%]">
        <MiniSite p={p} title={title} />
      </div>
    </div>
  );
}

function Laptop({ p, title }: { p: Palette; title: string }) {
  return (
    <div className="absolute top-[52%] left-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-t-[1.6cqw] bg-[#111] p-[1.1cqw] shadow-[0_3cqw_6cqw_-2cqw_rgb(0_0_0/0.6)]">
        <div className="aspect-[16/10] overflow-hidden rounded-[0.5cqw]">
          <MiniSite p={p} title={title} />
        </div>
      </div>
      <div className="relative mx-[-6%] h-[2.2cqw] rounded-b-[1.6cqw] bg-gradient-to-b from-[#3a3a3a] to-[#161616]">
        <span className="absolute top-0 left-1/2 h-[0.8cqw] w-[14%] -translate-x-1/2 rounded-b-[0.8cqw] bg-[#0b0b0b]" />
      </div>
    </div>
  );
}

function Phone({ p, title, className }: { p: Palette; title: string; className: string }) {
  return (
    <div className={`absolute aspect-[9/19] rounded-[3.2cqw] bg-[#0d0d0d] p-[0.7cqw] shadow-[0_3cqw_6cqw_-1.5cqw_rgb(0_0_0/0.5)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[2.6cqw]">
        <MiniSite p={p} mobile title={title} />
        <span className="absolute top-[1.4%] left-1/2 h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-[#0d0d0d]" />
      </div>
    </div>
  );
}

function Phones({ p, title }: { p: Palette; title: string }) {
  return (
    <>
      <Phone p={p} title={title} className="top-[22%] left-[22%] w-[19%] -rotate-6" />
      <Phone p={p} title={title} className="top-[12%] left-1/2 z-10 w-[21%] -translate-x-1/2" />
      <Phone p={p} title={title} className="top-[22%] right-[22%] w-[19%] rotate-6" />
    </>
  );
}

function Poster({ p, title }: { p: Palette; title: string }) {
  return (
    <>
      <span
        className="absolute top-[12%] left-[7%] max-w-[70%] font-medium leading-[0.86] tracking-[-0.06em]"
        style={{ color: p.ink, fontSize: "11cqw" }}
      >
        {title}
      </span>
      <span className="absolute right-[8%] bottom-[12%] size-[22cqw] rounded-full" style={{ background: p.accent, opacity: 0.9 }} />
      <span className="absolute right-[20%] bottom-[22%] size-[12cqw] rounded-full" style={{ background: p.from, mixBlendMode: "screen" }} />
      <span className="absolute bottom-[10%] left-[7%] flex flex-col gap-[1cqw]">
        {["34cqw", "26cqw", "30cqw"].map((w, i) => (
          <span key={i} className="block h-[1cqw] rounded-full" style={{ width: w, background: p.ink, opacity: 0.35 }} />
        ))}
      </span>
    </>
  );
}

export default function ProjectArt({
  project,
  variant,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  project: Project;
  variant?: ArtVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { palette: p, title } = project;

  if (project.cover && !variant) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`}>
        <Image src={project.cover} alt={`${title} cover`} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const v = variant ?? project.art;
  return (
    <div
      aria-hidden="true"
      className={`@container relative h-full w-full overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 30% 20%, ${p.from}, ${p.to})` }}
    >
      {/* soft light blobs */}
      <span className="absolute -top-[20%] -left-[10%] size-[60cqw] rounded-full opacity-40 blur-[8cqw]" style={{ background: p.accent }} />
      <span className="absolute -right-[15%] -bottom-[30%] size-[55cqw] rounded-full opacity-30 blur-[9cqw]" style={{ background: p.from }} />
      {v === "browser" && <Browser p={p} title={title} />}
      {v === "laptop" && <Laptop p={p} title={title} />}
      {v === "phones" && <Phones p={p} title={title} />}
      {v === "poster" && <Poster p={p} title={title} />}
      {/* subtle vignette */}
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.25))]" />
    </div>
  );
}
