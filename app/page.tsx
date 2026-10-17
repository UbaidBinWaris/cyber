import Link from "next/link";
import { CATEGORIES, CHAPTERS, getCategoryChapters } from "@/lib/chapters";
import { Icon } from "./components/Icon";

export default function Home() {
  const totalMinutes = CHAPTERS.reduce((sum, c) => sum + c.minutes, 0);
  const hours = Math.round(totalMinutes / 60);

  return (
    <>
      <section className="hero">
        <span className="eyebrow">
          <Icon name="shield" size={15} /> Offensive &amp; Defensive · Plain English
        </span>
        <h1>
          Learn cyber security, <span className="hl">the hands-on way.</span>
        </h1>
        <p className="hero-lede">
          A self-paced course that teaches how real attacks happen and exactly how to stop them.
          Every chapter follows the same shape: what it is, a real-world example, how the attack
          works, the real tools, and how to prevent it. No fluff, no pure theory.
        </p>
        <div className="hero-cta">
          <Link href="/guide/start-here" className="btn btn-primary">
            Start learning <Icon name="arrowRight" size={18} />
          </Link>
          <Link href="/guide/cryptography" className="btn btn-ghost">
            <Icon name="lock" size={17} /> Jump to Cryptography
          </Link>
        </div>

        <div className="stat-row">
          <div>
            <div className="stat-num">{CHAPTERS.length}</div>
            <div className="stat-label">Chapters</div>
          </div>
          <div>
            <div className="stat-num">{CATEGORIES.length}</div>
            <div className="stat-label">Learning tracks</div>
          </div>
          <div>
            <div className="stat-num">~{hours}h</div>
            <div className="stat-label">Total reading</div>
          </div>
          <div>
            <div className="stat-num">60+</div>
            <div className="stat-label">Real tools covered</div>
          </div>
        </div>
      </section>

      <div className="notice">
        <Icon name="shield" size={18} />
        <span>
          <strong>Ethics first.</strong> Everything here is for systems you own or have written
          permission to test. Unauthorized access is illegal. This guide points to legal practice
          labs throughout.
        </span>
      </div>

      {CATEGORIES.map((cat) => {
        const items = getCategoryChapters(cat.id);
        if (items.length === 0) return null;
        return (
          <section key={cat.id} className="track">
            <div className="track-head">
              <span className="track-icon">
                <Icon name={cat.icon} size={22} />
              </span>
              <div>
                <h2 className="track-title">{cat.name}</h2>
                <p className="track-tagline">{cat.tagline}</p>
              </div>
            </div>

            <div className="card-grid">
              {items.map((c) => (
                <Link key={c.slug} href={`/guide/${c.slug}`} className="card">
                  <div className="card-top">
                    <span className="card-icon">
                      <Icon name={c.icon} size={20} />
                    </span>
                    <span className="card-num">CH {c.num}</span>
                  </div>
                  <span className="card-title">{c.title}</span>
                  <span className="card-blurb">{c.blurb}</span>
                  <div className="card-meta">
                    <span className={`chip diff diff-${c.difficulty}`}>
                      <span className="diff-dot" /> {c.difficulty}
                    </span>
                    <span className="chip chip-time">
                      <Icon name="clock" size={12} /> {c.minutes} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <footer className="landing-foot">
        <p>CyberGuide · A complete, self-paced security course. Learn offense. Build defense. Act ethically.</p>
      </footer>
    </>
  );
}
