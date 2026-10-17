# 12 - Governance, Risk & Compliance (GRC)

Technology alone doesn't make an organization secure - **decisions, rules, and accountability** do. GRC is the management layer: deciding what to protect, how much to spend, who's responsible, and proving it to regulators. It sounds dry, but it's where security actually becomes *organizational* rather than a few heroes firefighting.

---

## 12.1 The three pieces in plain English

- **Governance** - *who decides and who's accountable.* Leadership sets the direction, assigns ownership, and funds security. (Security that isn't backed by leadership fails.)
- **Risk management** - *what could go wrong, how likely, how bad, and what we'll do about it.*
- **Compliance** - *proving we meet required laws, regulations, and standards.*

---

## 12.2 Risk management - the core skill

You can't eliminate all risk; you **manage** it. The basic formula:

```
Risk = Likelihood × Impact
```

For each risk, pick one of four responses:
- **Mitigate** - reduce it (add a control). *E.g., add MFA to reduce account-takeover risk.*
- **Transfer** - shift it (e.g., cyber insurance, outsourcing).
- **Accept** - it's small/cheap enough to live with (documented, signed off).
- **Avoid** - stop doing the risky thing entirely.

**Real-world example:** A company finds an old app with a vulnerability. Options: patch it (mitigate), put it behind a WAF and restrict access (mitigate), retire it (avoid), or - if it's low-value and isolated - formally accept the risk. GRC makes that a *deliberate, documented decision* by an accountable owner, not an accident.

**Risk register:** the living document listing each risk, its rating, owner, and treatment. This is the backbone of a security program.

---

## 12.3 The major frameworks (and what each is for)

| Framework | What it is | When you use it |
|-----------|-----------|-----------------|
| **NIST Cybersecurity Framework (CSF)** | 6 functions: **Govern, Identify, Protect, Detect, Respond, Recover** | A flexible, universal way to structure *any* security program |
| **ISO/IEC 27001** | International standard for an Information Security Management System (ISMS); you can get **certified** | Proving security maturity to partners/customers globally |
| **NIST 800-53** | Exhaustive catalog of security controls | US government and detailed control selection |
| **CIS Controls** | 18 prioritized, practical controls ("do these first") | A concrete starting checklist for any org |
| **MITRE ATT&CK** | Attacker techniques (Ch. 08) | Mapping detections and testing coverage |
| **OWASP** | Web/app security guidance (Ch. 04) | Securing software |

**The NIST CSF functions are a great mental model for this entire guide:**
- **Govern** → Ch. 12 (this chapter)
- **Identify** → Ch. 02 (know your assets & exposure)
- **Protect** → Ch. 01, 03, 04, 05, 07, 09, 10 (controls)
- **Detect** → Ch. 11 (logging, SIEM)
- **Respond** → Ch. 11 (incident response)
- **Recover** → Ch. 07, 11 (backups, restoration)

---

## 12.4 Compliance & regulations you'll hear about

- **GDPR** (EU) - personal data protection; big fines (up to 4% of global revenue). Breach notification within 72 hours.
- **HIPAA** (US) - healthcare data.
- **PCI DSS** - anyone handling payment cards.
- **SOC 2** - a report proving your controls to business customers (common for SaaS).
- **CCPA/CPRA** (California), **DPDP** (India), and many national laws - privacy is global now.

**Key point:** Compliance is the **floor, not the ceiling.** Being compliant ≠ being secure. Plenty of breached companies were "compliant." Use frameworks as a baseline, then exceed them where your real risks demand it.

---

## 12.5 Policies that actually matter

Good security programs document and enforce:
- **Acceptable Use Policy** - what employees can/can't do on company systems.
- **Access Control Policy** - least privilege, joiner/mover/leaver processes.
- **Incident Response Plan** (Ch. 11) - tested, not just written.
- **Business Continuity / Disaster Recovery (BCP/DR)** - how the business keeps running through a crisis; **RTO** (how fast you must recover) and **RPO** (how much data loss is tolerable).
- **Data Classification** - label data (public/internal/confidential/restricted) so controls match sensitivity.
- **Vendor/Third-Party Risk Management** - your suppliers' security is *your* risk (SolarWinds, Ch. 09).

**The human truth:** policies only work if they're practical, trained, and enforced. A policy nobody follows is worse than none - it creates false confidence.

➡️ Next: [13 - Your Home Lab & Career Path](13-lab-and-career.md)
