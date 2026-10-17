# 05 - Authentication & Passwords

Authentication is proving you are who you claim to be. It's the front door to everything, which is exactly why attackers focus on it. This chapter covers how credentials get stolen and cracked - and how to make that pointless.

---

## 5.1 How passwords are stored (and why hashing matters)

**Never store passwords as plaintext.** If the database leaks, every account is instantly compromised - and people reuse passwords, so you've compromised their other accounts too.

Instead, store a **hash** - a one-way fingerprint. `password123` → `ef92b778...`. You can compute the hash from the password, but not the password from the hash. At login, you hash what they typed and compare.

**But plain hashing isn't enough:**
- **Salting:** add a unique random value per user before hashing. This stops attackers from using precomputed **rainbow tables** and means two users with the same password get different hashes.
- **Slow hashing:** use algorithms *designed* to be slow - **bcrypt**, **scrypt**, or **Argon2** (the modern winner). Fast hashes (MD5, SHA-1, plain SHA-256) let attackers try billions of guesses per second. Slow hashes make mass cracking impractical.

```
WRONG:  store md5(password)
RIGHT:  store argon2(password + per-user salt)   // slow + salted
```

---

## 5.2 Password cracking - how the guessing works

Once attackers steal a hash dump, they try to recover passwords **offline** (on their own hardware, no rate limits).

- **Dictionary attack:** try known/common passwords and leaked password lists (e.g., `rockyou.txt`).
- **Brute force:** try every combination (slow; only works on short passwords).
- **Rule-based / hybrid:** take dictionary words and apply transformations (`password` → `P@ssw0rd!`) - because humans are predictable.

**Real tools:** **Hashcat** (GPU-accelerated, the standard), **John the Ripper**. These exist so defenders can audit their own password strength and so pentesters can demonstrate risk - use only on hashes you're authorized to test.

**The lesson:** a short or common password falls in seconds regardless of how well it's hashed. Length and unpredictability are what actually protect you.

---

## 5.3 Credential stuffing - the most common account takeover

**What it is:** Attackers take username/password pairs from *other* sites' breaches and try them on *your* site, betting people reuse passwords. They automate it with millions of combos.

**Real-world example:** Countless "we were breached" notices are actually credential stuffing - the company wasn't hacked; their users reused passwords that leaked elsewhere. Streaming services, retailers, and gaming platforms get hit constantly.

**How to prevent it:**
- **MFA** (below) - a reused password alone no longer works.
- **Rate limiting & lockouts** on login attempts.
- **Bot detection / CAPTCHA** on suspicious patterns.
- **Check credentials against breach lists** (Have I Been Pwned's API) and force resets.
- **Alert users** on logins from new devices/locations.

---

## 5.4 Multi-Factor Authentication (MFA) - the single best control

MFA requires two or more of: **something you know** (password), **something you have** (phone/key), **something you are** (fingerprint). Even a perfectly stolen password fails without the second factor.

**Strength ranking (use the strongest you can):**
1. **Hardware security keys / passkeys (FIDO2/WebAuthn)** - strongest; *phishing-resistant* because they're cryptographically bound to the real site. An attacker's fake page can't use them.
2. **Authenticator app (TOTP)** - the 6-digit codes (Google Authenticator, Authy). Strong and easy.
3. **SMS codes** - better than nothing, but weakest: vulnerable to **SIM swapping** (attacker ports your number) and interception. Avoid for high-value accounts.

**Real-world example - SIM swapping:** Attackers convince a mobile carrier to move a victim's number to the attacker's SIM, then receive the victim's SMS 2FA codes and drain crypto/bank accounts. This is *why* app-based or hardware MFA beats SMS.

---

## 5.5 Phishing for credentials & MFA fatigue

Even MFA can be attacked socially (full treatment in [Chapter 06](06-social-engineering.md)):
- **Phishing kits** proxy the real login page in real time, capturing both password *and* the TOTP code as the victim types it (**adversary-in-the-middle**). Defense: **phishing-resistant passkeys**, which don't send a code that can be relayed.
- **MFA fatigue / push bombing:** the attacker (already having the password) spams approval prompts until the tired victim taps "Approve." Defense: **number matching** (the app shows a number you must type), and limiting prompts.

---

## 5.6 The practical checklist

**For users:**
- Use a **password manager** (Bitwarden, 1Password) - unique, long, random passwords everywhere.
- Turn on **MFA** on every important account; prefer an **authenticator app or passkey** over SMS.
- Never reuse passwords.

**For developers/orgs:**
- Hash with **Argon2/bcrypt + salt**. Never roll your own.
- **Enforce MFA**, ideally phishing-resistant, for all staff and admin access.
- **Rate-limit** logins; detect and block credential stuffing.
- **Never leak which accounts exist** ("invalid username or password" - not "no such user").
- Secure the **password reset** flow (it's a backdoor if weak) - short-lived, single-use tokens.
- Move toward **passwordless / passkeys** where possible.

➡️ Next: [06 - Social Engineering](06-social-engineering.md)
