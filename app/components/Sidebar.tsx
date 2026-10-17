"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Category, Chapter } from "@/lib/chapters";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";
import { useCompleted } from "@/lib/useProgress";

export function Sidebar({
  chapters,
  categories,
}: {
  chapters: Chapter[];
  categories: Category[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const done = useCompleted();

  const completed = chapters.filter((c) => done.has(c.slug)).length;
  const pct = Math.round((completed / chapters.length) * 100);

  return (
    <>
      <div className="mobile-bar">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden><Icon name="shield" size={20} /></span>
          <span>CyberGuide</span>
        </Link>
        <button
          className="menu-btn"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Link href="/" className="brand brand-desktop" onClick={() => setOpen(false)}>
            <span className="brand-mark" aria-hidden><Icon name="shield" size={20} /></span>
            <span>CyberGuide</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="progress-card">
          <div className="progress-row">
            <span>Your progress</span>
            <span className="progress-count">{completed}/{chapters.length}</span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>

        <nav className="nav" aria-label="Chapters">
          {categories.map((cat) => {
            const items = chapters.filter((c) => c.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id} className="nav-group">
                <p className="nav-group-title">
                  <Icon name={cat.icon} size={14} />
                  {cat.name}
                </p>
                {items.map((c) => {
                  const href = `/guide/${c.slug}`;
                  const active = pathname === href;
                  return (
                    <Link
                      key={c.slug}
                      href={href}
                      className={`nav-item ${active ? "nav-active" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className={`nav-check ${done.has(c.slug) ? "nav-check-done" : ""}`} aria-hidden>
                        {done.has(c.slug) ? "✓" : c.num}
                      </span>
                      <span className="nav-label">{c.short}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <p>Learn offense. Build defense.</p>
          <p className="sidebar-foot-sub">For authorized, educational use only.</p>
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden />}
    </>
  );
}
