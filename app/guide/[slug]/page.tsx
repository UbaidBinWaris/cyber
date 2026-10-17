import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CATEGORIES,
  CHAPTERS,
  getAdjacent,
  getChapterBySlug,
  readChapterMarkdown,
} from "@/lib/chapters";
import { renderMarkdown } from "@/lib/markdown";
import { Icon } from "../../components/Icon";
import { CompleteButton } from "../../components/CompleteButton";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return { title: "Not found" };
  return { title: chapter.title, description: chapter.blurb };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const category = CATEGORIES.find((c) => c.id === chapter.category);
  const md = readChapterMarkdown(chapter);
  const { prev, next } = getAdjacent(slug);

  // Strip the content files' own trailing nav lines and their leading H1
  // (we render a styled chapter header instead, so the title is not duplicated).
  const lines = md.split("\n").filter((l) => !/^(➡️|⬅️)/.test(l.trim()));
  if (lines[0]?.startsWith("# ")) {
    lines.shift();
    while (lines[0]?.trim() === "") lines.shift();
  }
  const cleaned = lines.join("\n").trimEnd();

  return (
    <article>
      <header className="chapter-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden>/</span>
          <span>{category?.name}</span>
        </nav>
        <div className="chapter-badges">
          <span className="badge-num">CHAPTER {chapter.num}</span>
          <span className={`chip diff diff-${chapter.difficulty}`}>
            <span className="diff-dot" /> {chapter.difficulty}
          </span>
          <span className="chip chip-time">
            <Icon name="clock" size={13} /> {chapter.minutes} min read
          </span>
        </div>
        <h1 className="display" style={{ fontSize: "clamp(2rem, 4.5vw, 2.7rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.12 }}>
          {chapter.title}
        </h1>
      </header>

      <div className="prose">{renderMarkdown(cleaned)}</div>

      <CompleteButton slug={chapter.slug} />

      <nav className="pager" aria-label="Chapter navigation">
        {prev ? (
          <Link href={`/guide/${prev.slug}`} className="pager-link">
            <span className="pager-dir">← Previous</span>
            <span className="pager-title">{prev.title}</span>
          </Link>
        ) : (
          <Link href="/" className="pager-link">
            <span className="pager-dir">← Home</span>
            <span className="pager-title">Course overview</span>
          </Link>
        )}
        {next && (
          <Link href={`/guide/${next.slug}`} className="pager-link pager-next">
            <span className="pager-dir">Next →</span>
            <span className="pager-title">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
