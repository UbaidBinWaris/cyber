import React from "react";
import Link from "next/link";
import { CHAPTERS } from "./chapters";

/**
 * A small, dependency-free Markdown → React renderer, scoped to exactly the
 * constructs used by the guide's content files (headings, tables, fenced code,
 * ordered/unordered lists, blockquotes, hr, and inline bold/italic/code/links).
 *
 * Why hand-rolled instead of react-markdown? It keeps the project dependency
 * free, lets internal `*.md` links rewrite to clean site routes, and gives us
 * full control over the emitted class names so the design system in globals.css
 * applies cleanly. The markdown files remain the single source of truth.
 */

// Map a markdown href like "10-cryptography.md" or "04-x.md#frag" to /guide/slug.
function resolveHref(href: string): string {
  const external = /^https?:\/\//i.test(href);
  if (external) return href;
  const [file, frag] = href.split("#");
  const match = CHAPTERS.find((c) => c.file === file);
  if (match) return `/guide/${match.slug}${frag ? `#${frag}` : ""}`;
  return href;
}

let keyCounter = 0;
const nextKey = () => `md-${keyCounter++}`;

// ---- Inline parsing: **bold**, *italic*, `code`, [text](href) ----
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: code first (so ** inside code is literal), then links, then bold, then italic.
  const pattern = /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("`")) {
      nodes.push(<code key={nextKey()}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)!;
      const href = resolveHref(lm[2]);
      const isExternal = /^https?:\/\//i.test(href);
      nodes.push(
        isExternal ? (
          <a key={nextKey()} href={href} target="_blank" rel="noopener noreferrer">
            {lm[1]}
          </a>
        ) : (
          <Link key={nextKey()} href={href}>
            {lm[1]}
          </Link>
        )
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={nextKey()}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={nextKey()}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Build a URL-safe slug for heading anchors.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderTable(lines: string[]): React.ReactNode {
  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
  const header = parseRow(lines[0]);
  const body = lines.slice(2).map(parseRow);
  return (
    <div className="table-wrap" key={nextKey()}>
      <table>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i}>{parseInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{parseInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function renderMarkdown(md: string): React.ReactNode[] {
  keyCounter = 0;
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block (indentation-aware: a fence may be nested under a list
    // item, e.g. two-space-indented ```). We capture the opening indent and
    // strip it from each line so the block renders cleanly dedented.
    const fence = /^(\s*)```/.exec(line);
    if (fence) {
      const indent = fence[1].length;
      const strip = (l: string) => l.slice(0, indent).trim() === "" ? l.slice(indent) : l;
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        code.push(strip(lines[i]));
        i++;
      }
      i++; // closing fence
      out.push(
        <pre key={nextKey()}>
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push(<hr key={nextKey()} />);
      i++;
      continue;
    }

    // Headings
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      const id = slugify(text);
      const content = parseInline(text);
      if (level === 1) out.push(<h1 key={nextKey()}>{content}</h1>);
      else if (level === 2) out.push(<h2 key={nextKey()} id={id}>{content}</h2>);
      else if (level === 3) out.push(<h3 key={nextKey()} id={id}>{content}</h3>);
      else out.push(<h4 key={nextKey()} id={id}>{content}</h4>);
      i++;
      continue;
    }

    // Blockquote (supports a danger/warn flavor based on leading emoji)
    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const joined = quote.join(" ");
      const flavor = /⚠️|⚠/.test(joined) ? "warn" : "";
      out.push(
        <blockquote key={nextKey()} className={flavor}>
          <p>{parseInline(joined)}</p>
        </blockquote>
      );
      continue;
    }

    // Table (header row followed by a separator row of ---|---)
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]+$/.test(lines[i + 1])) {
      const tbl: string[] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        tbl.push(lines[i]);
        i++;
      }
      out.push(renderTable(tbl));
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*[-*]\s+/, "");
        items.push(<li key={nextKey()}>{parseInline(text)}</li>);
        i++;
      }
      out.push(<ul key={nextKey()}>{items}</ul>);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*\d+\.\s+/, "");
        items.push(<li key={nextKey()}>{parseInline(text)}</li>);
        i++;
      }
      out.push(<ol key={nextKey()}>{items}</ol>);
      continue;
    }

    // Paragraph (gather consecutive non-structural lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(<p key={nextKey()}>{parseInline(para.join(" "))}</p>);
  }

  return out;
}
