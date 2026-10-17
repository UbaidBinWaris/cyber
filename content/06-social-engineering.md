# 06 - Social Engineering

**The most reliable attack doesn't target computers - it targets people.** You can have perfect firewalls and still get breached because someone clicked a link or held a door open. Social engineering exploits trust, fear, urgency, and helpfulness. The vast majority of real breaches begin here.

> This chapter is about *recognizing and defending against* manipulation. The defenses are the point.

---

## 6.1 Phishing - the #1 way in

**What it is:** A fraudulent message (usually email) that tricks you into clicking a malicious link, opening a malicious attachment, or handing over credentials.

**How a real attack works, step by step:**
1. Recon (Ch. 02) gives the attacker employee emails and the company's email format.
2. They register a lookalike domain: `acme-corp.com` vs real `acmecorp.com`, or `rnicrosoft.com` ("rn" looks like "m").
3. They send an urgent email: *"Your password expires in 1 hour - click here to keep your account."*
4. The link goes to a pixel-perfect fake login page.
5. The victim enters their credentials → straight to the attacker. Modern kits even relay the MFA code live (Ch. 05).

**Variants:**
- **Spear phishing** - personalized to a specific person (uses their name, role, real projects). Far more effective.
- **Whaling** - targets executives (big payoff).
- **BEC (Business Email Compromise)** - impersonates a CEO/vendor to authorize fraudulent wire transfers. *This causes billions in losses annually* - often no malware at all, just a convincing email.
- **Smishing** (SMS) and **Vishing** (voice calls).

**Real-world example:** An employee gets an email "from the CEO" (spoofed) saying *"I'm in a meeting, urgently need you to pay this vendor invoice - here are the wire details."* The urgency and authority short-circuit skepticism. Money sent. This is BEC, and it works constantly.

---

## 6.2 Pretexting, baiting, tailgating

- **Pretexting:** inventing a believable scenario. *"Hi, I'm from IT, we detected a problem with your account, I just need your password to fix it."*
- **Baiting:** leaving infected USB drives in a parking lot labeled "Salaries 2026." Curiosity does the rest.
- **Tailgating / piggybacking:** physically following an employee through a secure door ("my hands are full, can you hold it?").
- **Quid pro quo:** offering something ("free IT support") in exchange for access.

---

## 6.3 Why it works - the psychology

Attackers deliberately trigger:
- **Authority** - we obey perceived bosses/officials.
- **Urgency & scarcity** - "act now or lose access" kills careful thinking.
- **Fear** - "your account is compromised."
- **Trust/helpfulness** - we want to be nice.
- **Social proof** - "everyone else already did this."

Recognizing *the emotion being pushed* is itself a defense. If a message makes you feel urgent fear, slow down - that's the red flag.

---

## 6.4 How to prevent it

**For individuals - the pause-and-verify habit:**
- **Check the sender's actual address**, not the display name. Hover over links before clicking; look at the real destination.
- **Be suspicious of urgency.** Legitimate orgs rarely demand instant action.
- **Verify out-of-band.** Payment request "from the CEO"? Call them on a *known* number. Never use contact details *from the suspicious message*.
- **Never give passwords or codes to anyone**, ever. No legitimate IT/bank asks for them.
- **Don't plug in unknown USB drives.**

**For organizations:**
- **Security awareness training** - the single highest-ROI control. Regular, practical, not once-a-year box-ticking.
- **Simulated phishing campaigns** (tools: **GoPhish** (open source), KnowBe4, Proofpoint) - send fake phishing to staff, then coach those who click. Measure improvement over time.
- **Email security tech:** **SPF, DKIM, and DMARC** - these DNS records stop attackers from spoofing *your* domain. Deploy all three (DMARC at `p=reject`).
- **External email banners** ("⚠ This email came from outside the organization").
- **Strict payment verification process** - require second approval and callback verification for wire transfers (kills BEC).
- **Phishing-resistant MFA (passkeys)** so stolen credentials are useless (Ch. 05).
- **Easy reporting** - a one-click "Report Phishing" button so staff flag threats fast.

**Key mindset:** You cannot patch humans, so you build *processes* that don't depend on any single person being perfect - plus technical controls that limit the blast radius when someone does slip.

➡️ Next: [07 - Malware & Endpoint Security](07-malware-endpoint.md)
