# 13 - Your Home Lab & Career Path

Reading teaches concepts; **hands-on practice** builds skill. This final chapter shows you how to build a safe, legal environment to practice everything in this guide, and how to turn these skills into a career.

---

## 13.1 Build a legal practice lab

**Never practice on systems you don't own or lack written permission to test.** Instead, build your own playground.

**The virtual lab (free):**
1. Install a **hypervisor** - **VirtualBox** (free) or VMware Workstation Player.
2. Add attacker and target VMs on an **isolated internal network** (no bridge to your real LAN).
3. **Attacker machine:** **Kali Linux** or **Parrot OS** - Linux distros pre-loaded with hundreds of security tools (Nmap, Burp, Metasploit, Wireshark, Hashcat, etc.).
4. **Target machines (deliberately vulnerable, made for this):**
   - **Metasploitable 2/3** - vulnerable Linux box.
   - **OWASP Juice Shop / DVWA / WebGoat** - vulnerable web apps (Ch. 04).
   - **VulnHub** - downloadable vulnerable VMs.
   - **Windows eval VMs + a small Active Directory** (e.g., GOAD - "Game of Active Directory") to practice Ch. 08.
5. **Snapshot** everything so you can revert after breaking it.

**Online practice platforms (no setup, legal targets):**
- **TryHackMe** - guided, beginner-friendly rooms. *Best starting point.*
- **Hack The Box** - more challenging, realistic machines; great for leveling up.
- **PortSwigger Web Security Academy** - free, world-class web security labs (by the Burp team).
- **picoCTF**, **OverTheWire**, **CTFtime** - capture-the-flag challenges.
- **RangeForce / CyberDefenders / Blue Team Labs Online** - for *defensive* (blue team) practice.

---

## 13.2 A realistic learning roadmap

**Stage 1 - Foundations (1–3 months)**
- Networking (how TCP/IP, DNS, HTTP really work), Linux command line, a scripting language (**Python** is the standard; some **Bash**).
- Read Ch. 01–03 of this guide; do TryHackMe's beginner paths.

**Stage 2 - Core security (3–6 months)**
- Web security (Ch. 04) via PortSwigger Academy.
- Build the lab; practice recon, scanning, exploitation on Metasploitable/VulnHub.
- Learn one SIEM (Wazuh/Splunk free) for the blue side.

**Stage 3 - Specialize (6–12+ months)**
Pick a direction (you can switch later):
- **Offensive:** penetration testing, red teaming, bug bounty.
- **Defensive:** SOC analyst, incident response, detection engineering.
- **AppSec / DevSecOps:** securing software and pipelines (Ch. 09).
- **Cloud security**, **GRC**, **forensics**, **malware analysis**.

**Stage 4 - Prove it**
- Earn a relevant certification (below).
- Do real **bug bounties** (HackerOne/Bugcrowd) or publish lab write-ups.
- Build a portfolio (blog, GitHub, CTF results).

---

## 13.3 Certifications that carry weight

| Level | Cert | Focus |
|-------|------|-------|
| **Entry** | **CompTIA Security+** | Broad fundamentals; great first cert, HR-recognized |
| Entry | **CompTIA Network+** | Networking base (optional but helpful) |
| Blue team | **Blue Team Level 1 (BTL1)**, **CySA+** | Defense, SOC, detection |
| Offensive (hands-on) | **OSCP** (PEN-200) | The respected practical pentest cert - 24-hour exam |
| Offensive (practical) | **PNPT**, **eJPT** (beginner), **CEH** (broad/theory) | Alternatives at different levels |
| Cloud | **AWS Security Specialty**, **Azure SC-200/AZ-500** | Cloud-specific |
| Management | **CISSP**, **CISM** | Senior/management, broad - needs experience |

**Advice:** Start with **Security+** for the baseline, then choose based on your specialization. For offensive roles, **OSCP** is the one most hiring managers recognize. Certs open doors; *demonstrated skill* (labs, bounties, write-ups) keeps them open.

---

## 13.4 Stay current (this field never stops)

- **News:** The Hacker News, BleepingComputer, Krebs on Security, Dark Reading.
- **Alerts:** CISA advisories, your vendors' security bulletins, CVE feeds.
- **Community:** r/netsec, r/cybersecurity, security Discords, local DEF CON groups / BSides conferences.
- **Deep learning:** MITRE ATT&CK, OWASP, NIST publications (all free), and the makers' docs for every tool in this guide.
- **Practice weekly.** Skills decay. A room on TryHackMe or a bug bounty session keeps you sharp.

---

## 13.5 The ethical core (never skip this)

Everything you've learned is **dual-use** - the same knowledge protects or harms. The line is simple and absolute:

- **Authorization.** Only test systems you own or have explicit, written permission to test.
- **Scope.** Stay within agreed boundaries, even when you *could* go further.
- **Disclosure.** Report vulnerabilities responsibly; give owners time to fix before publicizing.
- **Intent & integrity.** Use these skills to defend, to build, to get paid legitimately (bug bounties, a security career) - never to harm.

The best hackers are trusted *because* they're ethical. Your reputation is your career. Guard it harder than any system.

---

## You've finished the guide

You now understand the full picture: how attacks work across every layer, the real tools on both sides, and - most importantly - how to **prevent** and **respond**. From here it's practice. Spin up the lab, pick a path, and keep going.

🔒 *Learn offense. Build defense. Act ethically.*

⬅️ Back to [Start Here](00-start-here.md)
