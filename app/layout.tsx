import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";
import { CHAPTERS, CATEGORIES } from "@/lib/chapters";

const sora = Sora({ variable: "--font-display", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CyberGuide: Learn Cyber Security",
    template: "%s | CyberGuide",
  },
  description:
    "A self-paced cyber security course in plain English. Offensive and defensive, with real tools, real attacks, and how to prevent them.",
  robots: { index: true, follow: true },
};

// Applied before paint so the chosen theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem('cg-theme');if(!t){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sora.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <div className="shell">
          <Sidebar chapters={CHAPTERS} categories={CATEGORIES} />
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
