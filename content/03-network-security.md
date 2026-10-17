# 03 - Network Security

The network is the battlefield. This chapter covers how attackers map and move through networks, how traffic gets intercepted, and the defenses that contain them.

---

## 3.1 Port scanning - the attacker's floor plan

**What it is:** A computer offers services on numbered "ports" (SSH=22, HTTP=80, HTTPS=443, RDP=3389, databases=3306/5432, etc.). **Port scanning** knocks on every port to see which are open and what's behind them. It's how an attacker draws a floor plan of your network.

**The tool:** **Nmap** (Network Mapper) - the industry-standard scanner, used by attackers and defenders alike.

```bash
# Discover live hosts on a network (ping sweep)
nmap -sn 192.168.1.0/24

# Scan common ports + detect service versions + OS
nmap -sV -O 192.168.1.10

# Full, thorough scan of one host (all 65535 ports)
nmap -p- -sV -sC 192.168.1.10

# Run Nmap's vulnerability scripts
nmap --script vuln 192.168.1.10
```

**Real-world example:** A scan reveals port 3306 (MySQL) open to the whole internet with version 5.5 - years out of date. That single open port is an invitation: the attacker now looks up known exploits for MySQL 5.5 and the misconfiguration of exposing a database publicly.

**How to prevent it:**
- **Close every port you don't need.** If a service doesn't need to be reachable, firewall it off.
- **Never expose databases, admin panels, or management ports (SSH/RDP) directly to the internet.** Put them behind a VPN or bastion host.
- **Detect scans:** an IDS like **Suricata** or **Snort** flags the rapid connection attempts that scanning produces. Rate-limit and alert.
- **Keep services patched** so even a discovered version has no known exploit.

---

## 3.2 Firewalls & network segmentation

**Firewall:** a gatekeeper that allows or blocks traffic by rules (source, destination, port). **Default deny** is the golden rule: block everything, then allow only what's needed.

```bash
# Linux ufw example: default deny, allow only SSH + HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Segmentation:** splitting your network into isolated zones so a breach in one can't reach the others.

**Real-world example - the 2013 Target breach (40M+ cards):** Attackers got in through an **HVAC vendor's** network credentials. Because Target's network was *not segmented*, the path from the air-conditioning system reached the payment systems. Proper segmentation would have stopped the HVAC foothold from ever touching card data. This is the textbook case for why segmentation matters.

**How to apply it:**
- Separate zones: user workstations / servers / databases / guest Wi-Fi / payment systems - each isolated.
- Use **VLANs** and internal firewalls between zones.
- Apply **Zero Trust**: even internal traffic must authenticate.

---

## 3.3 Man-in-the-Middle (MITM) - intercepting traffic

**What it is:** The attacker secretly sits between you and what you're talking to, reading or altering traffic. Common on untrusted Wi-Fi (coffee shops, airports).

**How the attack works (ARP spoofing on a LAN):**
1. On a local network, devices find each other using **ARP** (IP → MAC address mapping). ARP blindly trusts replies.
2. The attacker floods the network with fake ARP replies: "I am the router."
3. Victim traffic now flows *through* the attacker, who can read or modify it.

**Real tools attackers use:** `Ettercap`, `bettercap`, `arpspoof`. For inspecting traffic: **Wireshark** (the standard packet analyzer).

**Real-world example:** On open coffee-shop Wi-Fi, an attacker ARP-spoofs the network and captures traffic. Any site still using plain HTTP leaks logins in cleartext. For HTTPS sites, they may attempt **SSL stripping** (downgrading HTTPS to HTTP) if the site isn't protected.

**How to prevent it:**
- **Use HTTPS everywhere** and enable **HSTS** (HTTP Strict Transport Security) so browsers refuse to downgrade to HTTP - this defeats SSL stripping.
- **Use a VPN on untrusted networks** - it encrypts all traffic end to end, so even a MITM sees only ciphertext.
- **Enable Dynamic ARP Inspection** on managed switches to block spoofed ARP replies.
- **Watch for certificate warnings** - never click through them.

---

## 3.4 VPNs - what they really do

A **VPN** (Virtual Private Network) builds an encrypted tunnel between you and a VPN server. Everything inside is unreadable to anyone on the local network. Two uses:

- **Remote access VPN:** employees securely reach the company network from home.
- **Privacy VPN:** hides your traffic from the local network/ISP (but the VPN provider can see it - choose a trustworthy one).

**Modern tool:** **WireGuard** - fast, simple, modern cryptography; now the preferred choice over older OpenVPN/IPsec for many setups.

**Security note:** A VPN is a tunnel, not a magic shield. It doesn't protect you from malware, phishing, or a compromised endpoint - it only protects traffic *in transit*.

---

## 3.5 Denial of Service (DoS / DDoS)

**What it is:** Overwhelming a system with traffic so legitimate users can't reach it (breaks **Availability**). **DDoS** = Distributed: thousands of machines (a **botnet**) attack at once.

**Real-world example - the 2016 Mirai botnet:** Mirai infected hundreds of thousands of insecure IoT devices (cameras, routers using default passwords) and used them to launch a massive DDoS that took down Dyn (a major DNS provider), knocking Twitter, Netflix, Reddit, and others offline across the US east coast. Root cause: **default passwords on IoT devices.**

**How to prevent / survive it:**
- **DDoS mitigation services:** Cloudflare, AWS Shield, Akamai absorb and filter attack traffic at massive scale.
- **Rate limiting** on your application and APIs.
- **Overprovision and auto-scale** so you can soak up spikes.
- For the IoT lesson: **change default passwords**, isolate IoT on its own VLAN, keep firmware updated.

➡️ Next: [04 - Web Application Security](04-web-app-security.md)
