# The Complete Cyber Security Guide - Start Here

**Plain English. Real tools. Real attacks. Real prevention.**

This guide teaches you how attacks actually happen, and - more importantly - how to stop them. You learn offense so you can build defense. This is the exact logic every security professional uses: *you cannot protect a house if you do not understand how burglars get in.*

> ⚠️ **The one rule that matters.** Everything in this guide is for systems **you own** or have **written permission** to test. Running these techniques against someone else's network, website, or account without authorization is a crime in almost every country (in the US: the Computer Fraud and Abuse Act; in the UK: the Computer Misuse Act; similar laws everywhere). Learn on purpose-built practice labs - this guide points you to legal ones throughout.

---

## How to read this guide

Each chapter follows the same simple shape so nothing feels like abstract theory:

1. **What it is** - the idea in one or two plain sentences.
2. **Real-world example** - an actual incident or a concrete "this is what it looks like" scenario.
3. **How the attack works** - step by step, so you genuinely understand it.
4. **The real tools** - what attackers and defenders actually use (by name).
5. **How to prevent it** - specific, actionable defenses, not "be careful."

---

## The map of this guide

| # | Chapter | What you'll learn |
|---|---------|-------------------|
| 01 | [Foundations](01-foundations.md) | The core ideas: CIA triad, threat modeling, how the internet works under attack |
| 02 | [Reconnaissance](02-reconnaissance.md) | How attackers research a target before touching it (OSINT) |
| 03 | [Network Security](03-network-security.md) | Scanning, firewalls, segmentation, VPNs, how traffic gets intercepted |
| 04 | [Web Application Security](04-web-app-security.md) | The OWASP Top 10: SQL injection, XSS, CSRF, and more - with fixes |
| 05 | [Authentication & Passwords](05-authentication.md) | Password cracking, phishing, MFA, how credentials get stolen and protected |
| 06 | [Social Engineering](06-social-engineering.md) | Phishing, pretexting - attacking the human, and training against it |
| 07 | [Malware & Endpoint](07-malware-endpoint.md) | Viruses, ransomware, how infections spread and how EDR stops them |
| 08 | [Privilege Escalation & Post-Exploitation](08-post-exploitation.md) | What happens after a breach, and how to limit the damage |
| 09 | [Cloud, Containers & DevSecOps](09-cloud-devsecops.md) | Securing AWS/Azure/GCP, Docker, Kubernetes, CI/CD pipelines |
| 10 | [Cryptography](10-cryptography.md) | Encryption in plain English, TLS, hashing, what breaks it |
| 11 | [Blue Team & Incident Response](11-blue-team-ir.md) | Detection, logging, SIEM, and what to do when you're breached |
| 12 | [Governance, Risk & Compliance](12-grc.md) | Policies, frameworks (NIST, ISO 27001), and why they exist |
| 13 | [Your Home Lab & Career Path](13-lab-and-career.md) | Build a legal practice environment; certifications and jobs |

---

## The two mindsets

**Red Team (Offense)** - thinks like an attacker. "How do I get in?" Their job is to find holes *before* criminals do, with permission. Tools: Nmap, Burp Suite, Metasploit.

**Blue Team (Defense)** - thinks like a guard. "How do I detect and stop intrusions?" Their job is monitoring, hardening, and responding. Tools: Wireshark, SIEM (Splunk/Wazuh), EDR.

**Purple Team** - both working together: offense tells defense exactly what to watch for.

You will learn to think in all three modes. That is what makes this a *complete* guide.

➡️ Next: [01 - Foundations](01-foundations.md)
