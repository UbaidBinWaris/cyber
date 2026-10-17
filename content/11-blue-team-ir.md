# 11 - Blue Team & Incident Response

Offense gets the headlines; **defense wins the war.** This chapter is the defender's craft: seeing what's happening on your systems, detecting attacks, and responding when (not if) something gets through.

**Core truth:** *You cannot defend against what you cannot see.* Most breaches go undetected for weeks or months - the "dwell time." The blue team's mission is to shrink that to minutes.

---

## 11.1 Logging - the foundation of everything

If it isn't logged, it didn't happen (as far as investigation goes). Collect logs from everywhere:
- **Endpoints** - process creation, logins, PowerShell/command execution.
- **Network** - firewall, DNS, proxy, NetFlow.
- **Servers & apps** - web server, database, authentication.
- **Cloud** - CloudTrail / Azure / GCP audit logs.
- **Identity** - every login, MFA event, privilege change.

**Critical:** ship logs to a **central, tamper-resistant** location *immediately*. Attackers delete local logs to cover tracks (Ch. 08) - but can't delete what already left the building.

---

## 11.2 SIEM - turning logs into detection

A **SIEM** (Security Information and Event Management) collects all those logs, correlates them, and alerts on suspicious patterns.

**Real-world example of correlation:** One failed login = noise. But *"500 failed logins across 500 accounts from one IP in 2 minutes, then one success"* = credential stuffing with a hit. A SIEM connects those dots automatically and fires an alert.

**Real tools:** **Splunk** (market leader), **Microsoft Sentinel**, **Elastic Security (ELK)**, and the open-source powerhouse **Wazuh** (free, great for home labs and SMBs). **The Hive** + **Cortex** for case management.

**Detection engineering:** writing the rules/queries that catch attacker behavior. The modern language is **Sigma** (vendor-neutral detection rules you can translate to any SIEM), mapped to **MITRE ATT&CK** (Ch. 08) so you know exactly which techniques you can and can't catch.

---

## 11.3 The SOC & threat hunting

- **SOC (Security Operations Center):** the team/function that monitors alerts 24/7, triages them, and escalates real incidents. Organized in tiers (T1 triage → T2 investigate → T3 expert/hunt).
- **Threat hunting:** *proactively* searching for attackers who slipped past automated alerts - forming a hypothesis ("if an attacker were living off the land, I'd see unusual PowerShell") and hunting for evidence. Assume breach; go looking.

---

## 11.4 Incident Response - the plan for when it happens

Have this written **before** you need it. The standard lifecycle (NIST / SANS):

**1. Preparation** - tools, access, contacts, playbooks, backups, and training *ready in advance*. (The most important phase.)

**2. Identification / Detection** - confirm it's a real incident, determine scope. *What happened, what's affected, how bad?*

**3. Containment** - stop the bleeding.
- *Short-term:* isolate affected machines (pull from network), disable compromised accounts.
- *Long-term:* apply temporary fixes while you prepare full recovery.
- ⚠️ Don't just power off - you may destroy memory evidence. Isolate instead, preserve for forensics.

**4. Eradication** - remove the threat: malware, backdoors, attacker accounts, persistence (Ch. 08). Find the **root cause** - if you don't, they come back.

**5. Recovery** - restore systems from clean backups, rebuild, monitor closely for re-infection, return to normal operations carefully.

**6. Lessons Learned** - a blameless post-mortem: *How did they get in? What worked? What failed? What do we fix?* Feed it back into Preparation. This is how organizations get stronger.

**Real-world example:** The difference between a company that recovers from ransomware in 2 days and one that pays millions and loses customer trust is almost always **Preparation** - tested offline backups and a rehearsed plan vs. figuring it out in a panic.

---

## 11.5 Digital Forensics (DFIR)

When you need to know *exactly* what happened: collect and analyze evidence properly.
- **Preserve evidence** - work on copies, maintain **chain of custody** (who touched what, when) if it may go to court.
- **Capture volatile data first** (RAM, network connections) - it's gone on reboot.
- **Tools:** **Volatility** (memory forensics), **Autopsy/Sleuth Kit** (disk), **Velociraptor** (endpoint hunting/collection), **KAPE**, **Wireshark** (network).

---

## 11.6 Hardening & proactive defense (the boring stuff that works)

Most breaches exploit basics. Nail these:
- **Patch management** - the single highest-impact control. Patch fast, especially internet-facing.
- **Asset inventory** - you can't protect what you don't know you have.
- **Configuration hardening** - follow **CIS Benchmarks**; disable defaults.
- **Least privilege & MFA everywhere** (Ch. 01, 05).
- **Network segmentation** (Ch. 03).
- **Backups, tested** (3-2-1, offline copy) (Ch. 07).
- **Vulnerability scanning** - run **Nessus**, **OpenVAS**, or **Qualys** regularly to find holes before attackers do.
- **Security awareness training** (Ch. 06).
- **Regular penetration tests & red-team exercises** - pay professionals to attack you (with scope/permission) and fix what they find.

**The 80/20 of defense:** Patch, MFA, least privilege, segmentation, backups, logging, and user training stop the overwhelming majority of real attacks. Master the fundamentals before chasing exotic threats.

➡️ Next: [12 - Governance, Risk & Compliance](12-grc.md)
