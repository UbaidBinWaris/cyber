# 02 - Reconnaissance (OSINT)

**What it is:** Reconnaissance ("recon") is research. Before touching a target, attackers gather every public detail about it - employees, email formats, technologies, exposed servers, leaked passwords. It's the single most skipped step by beginners and the most important step for professionals. The more they know, the more precise the attack.

**Why defenders care:** Everything an attacker can find, *you* can find first - and remove or lock down. Recon is a two-way tool.

---

## 2.1 Passive recon - looking without touching

Passive recon never sends traffic to the target directly, so it's invisible. It uses public sources (OSINT = Open-Source Intelligence).

**Real-world example:** An attacker targeting "Acme Corp" finds on LinkedIn that Acme uses "firstname.lastname@acme.com". They scrape 200 employee names, generating 200 valid email addresses for phishing - without Acme ever knowing.

**What attackers collect:**
- **Employees & emails** - LinkedIn, company site, `hunter.io`.
- **Domains & subdomains** - `crt.sh` (certificate transparency logs reveal subdomains like `vpn.acme.com`, `dev.acme.com`).
- **Exposed devices** - **Shodan** (a search engine for internet-connected devices; finds open databases, cameras, industrial systems).
- **Leaked credentials** - **Have I Been Pwned**, breach-dump databases.
- **Code & secrets** - GitHub (developers accidentally commit API keys and passwords).
- **Metadata** - document properties in public PDFs leak usernames and software versions.

**Real tools:** `theHarvester` (emails/subdomains), `Shodan`, `Maltego` (visual relationship mapping), `recon-ng`, `crt.sh`, `Google Dorks` (advanced search like `site:acme.com filetype:pdf`), `amass` (subdomain enumeration), `GitLeaks`/`TruffleHog` (find secrets in repos).

---

## 2.2 Active recon - poking the target directly

Active recon sends packets to the target to map what's live. It's noisier and can be detected. (Only ever against systems you're authorized to test.)

- **Port scanning** - which services are running? (See Chapter 03 for Nmap in depth.)
- **Service/version detection** - "that's Apache 2.4.49" → look up its known vulnerabilities.
- **Directory brute-forcing** on websites - find hidden pages like `/admin`, `/backup.zip` using `ffuf`, `gobuster`, `dirsearch`.

---

## 2.3 How to prevent / reduce your exposure

Recon succeeds because organizations leak information. Shrink the leak:

1. **Audit your own footprint first.** Run `theHarvester`, Shodan, and `crt.sh` against *yourself* monthly. Fix what you find.
2. **Scan GitHub for secrets** with TruffleHog/GitLeaks in your CI pipeline - block commits containing keys. Rotate any key that was ever committed.
3. **Minimize public employee detail** where it enables targeting; train staff on what's safe to share.
4. **Remove document metadata** before publishing (tools: `exiftool`, "Inspect Document" in Office).
5. **Kill forgotten assets.** Old `dev.acme.com` servers are a top breach cause - maintain an asset inventory and decommission what you don't use.
6. **Register & monitor certificate transparency.** Set alerts so you know when a cert is issued for your domain (also catches phishing domains impersonating you).
7. **Enroll leaked-credential monitoring** (Have I Been Pwned "Domain Search") so you force password resets after breaches.

**Key mindset:** You can't stop people from searching. You *can* make sure what they find is empty.

➡️ Next: [03 - Network Security](03-network-security.md)
