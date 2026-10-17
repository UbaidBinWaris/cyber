import fs from "node:fs";
import path from "node:path";

export type Difficulty = "Intro" | "Easy" | "Medium" | "Hard";

export type Chapter = {
  slug: string;
  file: string;
  num: string;
  title: string;
  short: string;
  blurb: string;
  category: string;
  difficulty: Difficulty;
  minutes: number;
  icon: string;
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
};

/**
 * Learning tracks. Chapters carry a `category` id that points here. This drives
 * the TryHackMe-style grouped layout on the home page and the grouped sidebar.
 */
export const CATEGORIES: Category[] = [
  { id: "fundamentals", name: "Fundamentals", tagline: "The groundwork every path builds on.", icon: "foundation" },
  { id: "offensive", name: "Offensive Security", tagline: "Think like an attacker to find the holes first.", icon: "sword" },
  { id: "defensive", name: "Defensive Security", tagline: "Detect, harden, and respond to real intrusions.", icon: "shield" },
  { id: "specialized", name: "Specialized Domains", tagline: "Cloud, containers, and the maths behind the locks.", icon: "layers" },
  { id: "career", name: "Governance & Career", tagline: "Turn the skills into a job, done the right way.", icon: "compass" },
];

/**
 * Ordered table of contents. `slug` is the URL segment; `file` is the markdown
 * source in /content. Kept explicit (not globbed) for stable ordering and to
 * attach learning metadata the markdown does not carry.
 */
export const CHAPTERS: Chapter[] = [
  { slug: "start-here", file: "00-start-here.md", num: "00", title: "Start Here", short: "Start Here", blurb: "How to read this guide, the ground rules, and the full map.", category: "fundamentals", difficulty: "Intro", minutes: 8, icon: "flag" },
  { slug: "foundations", file: "01-foundations.md", num: "01", title: "Foundations", short: "Foundations", blurb: "CIA triad, threat modeling, defense in depth, the kill chain.", category: "fundamentals", difficulty: "Intro", minutes: 15, icon: "foundation" },
  { slug: "reconnaissance", file: "02-reconnaissance.md", num: "02", title: "Reconnaissance", short: "Recon (OSINT)", blurb: "How attackers research a target before touching it.", category: "offensive", difficulty: "Easy", minutes: 12, icon: "search" },
  { slug: "network-security", file: "03-network-security.md", num: "03", title: "Network Security", short: "Network", blurb: "Scanning, firewalls, segmentation, MITM, VPNs, DDoS.", category: "offensive", difficulty: "Medium", minutes: 18, icon: "network" },
  { slug: "web-app-security", file: "04-web-app-security.md", num: "04", title: "Web Application Security", short: "Web Apps", blurb: "The OWASP Top 10 with real attacks and exact fixes.", category: "offensive", difficulty: "Medium", minutes: 25, icon: "globe" },
  { slug: "authentication", file: "05-authentication.md", num: "05", title: "Authentication & Passwords", short: "Auth & Passwords", blurb: "Cracking, credential stuffing, MFA, phishing-resistant login.", category: "offensive", difficulty: "Medium", minutes: 16, icon: "key" },
  { slug: "social-engineering", file: "06-social-engineering.md", num: "06", title: "Social Engineering", short: "Social Engineering", blurb: "Phishing, pretexting, BEC: attacking and defending the human.", category: "offensive", difficulty: "Easy", minutes: 14, icon: "mail" },
  { slug: "malware-endpoint", file: "07-malware-endpoint.md", num: "07", title: "Malware & Endpoint", short: "Malware", blurb: "Viruses, ransomware, how infections spread, EDR defense.", category: "defensive", difficulty: "Medium", minutes: 18, icon: "bug" },
  { slug: "post-exploitation", file: "08-post-exploitation.md", num: "08", title: "Privilege Escalation & Post-Exploitation", short: "Post-Exploitation", blurb: "What happens after a breach, and how to contain it.", category: "offensive", difficulty: "Hard", minutes: 20, icon: "terminal" },
  { slug: "cloud-devsecops", file: "09-cloud-devsecops.md", num: "09", title: "Cloud, Containers & DevSecOps", short: "Cloud & DevSecOps", blurb: "Securing AWS/Azure/GCP, Docker, Kubernetes, CI/CD.", category: "specialized", difficulty: "Hard", minutes: 22, icon: "cloud" },
  { slug: "cryptography", file: "10-cryptography.md", num: "10", title: "Cryptography", short: "Cryptography", blurb: "Caesar cipher to modern models and all hashing, with pros and cons.", category: "specialized", difficulty: "Hard", minutes: 30, icon: "lock" },
  { slug: "blue-team-ir", file: "11-blue-team-ir.md", num: "11", title: "Blue Team & Incident Response", short: "Blue Team & IR", blurb: "Detection, logging, SIEM, and responding to a breach.", category: "defensive", difficulty: "Medium", minutes: 18, icon: "shield" },
  { slug: "grc", file: "12-grc.md", num: "12", title: "Governance, Risk & Compliance", short: "GRC", blurb: "Policies, risk management, NIST and ISO 27001 frameworks.", category: "career", difficulty: "Easy", minutes: 15, icon: "clipboard" },
  { slug: "lab-and-career", file: "13-lab-and-career.md", num: "13", title: "Home Lab & Career Path", short: "Lab & Career", blurb: "Build a legal practice lab; certifications and jobs.", category: "career", difficulty: "Easy", minutes: 16, icon: "compass" },
];

export function getCategoryChapters(categoryId: string): Chapter[] {
  return CHAPTERS.filter((c) => c.category === categoryId);
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getChapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function readChapterMarkdown(chapter: Chapter): string {
  return fs.readFileSync(path.join(CONTENT_DIR, chapter.file), "utf8");
}

export function getAdjacent(slug: string): { prev?: Chapter; next?: Chapter } {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return {
    prev: i > 0 ? CHAPTERS[i - 1] : undefined,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : undefined,
  };
}
