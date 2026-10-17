# 01 - Foundations

Before any attack or defense makes sense, you need the mental model everything hangs on. This chapter is short on purpose. Read it once and the rest of the guide clicks into place.

---

## 1.1 The CIA Triad - the goal of all security

Every security control exists to protect one of three things:

- **Confidentiality** - only the right people can read the data. *Example: your medical records should not be visible to strangers.*
- **Integrity** - data cannot be secretly changed. *Example: a bank balance of $5,000 must not be altered to $50,000.*
- **Availability** - the system is up when you need it. *Example: a hospital's systems must work 24/7.*

Every attack breaks at least one of these. Ransomware breaks availability (and often confidentiality). SQL injection breaks confidentiality and integrity. A DDoS breaks availability. When you evaluate any risk, ask: *which letter does this threaten?*

---

## 1.2 How the internet actually moves data (the 60-second version)

When you load `example.com`:

1. **DNS** turns `example.com` into an IP address (like a phone book: name → number).
2. Your computer opens a **TCP connection** to that IP on a **port** (web = 443 for HTTPS, 80 for HTTP).
3. **TLS** encrypts the connection so eavesdroppers see scrambled bytes.
4. **HTTP** carries the actual request ("GET me the homepage") and response (the HTML).

**Why this matters for security:** attackers abuse every layer.
- Poison DNS → send victims to a fake site.
- Scan ports → find forgotten services to break into.
- Strip TLS → read traffic in plaintext.
- Inject HTTP → steal sessions or inject malware.

Keep this stack in your head. Most of this guide is "here's how someone abuses one of these four steps, and here's how you stop them."

---

## 1.3 Threat modeling - think before you defend

You cannot defend against everything. **Threat modeling** is deciding *what* to defend and *against whom*. The simplest version, called **STRIDE**, asks six questions about your system:

| Letter | Threat | Plain-English question |
|--------|--------|------------------------|
| **S** | Spoofing | Can someone pretend to be someone else? |
| **T** | Tampering | Can someone change data they shouldn't? |
| **R** | Repudiation | Can someone deny doing something (no logs)? |
| **I** | Information disclosure | Can someone see data they shouldn't? |
| **D** | Denial of service | Can someone knock it offline? |
| **E** | Elevation of privilege | Can a normal user become an admin? |

**Real-world example:** You're building a login page. Threat-modeling it:
- *Spoofing* → add MFA so a stolen password isn't enough.
- *Tampering* → validate inputs server-side.
- *Repudiation* → log every login attempt.
- *Information disclosure* → never say "wrong password" vs "no such user" (that leaks which emails exist).
- *DoS* → rate-limit login attempts.
- *Elevation* → make sure a normal user can't hit admin routes.

That one exercise just produced six concrete controls. That's the whole job.

---

## 1.4 Defense in depth - layers, not walls

A single wall fails the moment it's breached. **Defense in depth** means stacking independent layers so one failure doesn't mean game over.

**Real-world example - protecting a database:**
1. Network firewall (DB not reachable from the internet)
2. Network segmentation (DB in a private subnet)
3. Authentication (strong DB credentials in a secrets manager)
4. Least privilege (app can only read what it needs)
5. Encryption at rest (stolen disk = useless)
6. Monitoring (alert on unusual queries)
7. Backups (ransomware recovery)

An attacker now has to beat **seven** things, not one.

---

## 1.5 Least privilege & Zero Trust - two rules that stop most damage

- **Least privilege:** every user, service, and process gets the *minimum* access it needs - nothing more. The intern's account can't delete production. The web server can't read the payroll table.
- **Zero Trust:** "never trust, always verify." Don't assume anything inside your network is safe. Every request is authenticated and authorized, every time, as if it came from the open internet.

These two ideas, applied consistently, neutralize a huge fraction of real attacks - because even when attackers get *in*, they can't get *far*.

---

## 1.6 The attacker's playbook (the kill chain)

Almost every real intrusion follows the same seven steps. Memorize this - the rest of the guide maps onto it:

1. **Reconnaissance** - research the target (Ch. 02)
2. **Weaponization & Delivery** - craft and send the attack (Ch. 06, 07)
3. **Exploitation** - break in (Ch. 03, 04, 05)
4. **Installation** - establish a foothold (Ch. 07)
5. **Command & Control** - remote-control the victim (Ch. 08)
6. **Actions on Objectives** - steal data, deploy ransomware (Ch. 08)
7. **Privilege escalation & lateral movement** happen throughout (Ch. 08)

**Defensive insight:** you don't have to stop every step. Break the chain **anywhere** and the attack fails. That's why layered defense works.

➡️ Next: [02 - Reconnaissance](02-reconnaissance.md)
