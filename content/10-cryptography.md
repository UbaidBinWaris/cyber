# 10 - Cryptography: From Caesar Cipher to Modern Models

This is the deep chapter. We start with the simplest cipher a child could do by hand, and climb - step by step, with worked examples and diagrams - all the way to the encryption that protects banks, messengers, and nations. Then we cover **every major family of hashing**. Each technique comes with a concrete example and honest **pros & cons**.

**The three jobs of cryptography:**
- **Encryption** → confidentiality (keep secrets secret).
- **Hashing** → integrity (detect any change) + password storage.
- **Signatures/MACs** → authenticity (prove who sent it, prove it wasn't altered).

---

## Part A - Encryption, from ancient to modern

### 10.1 Caesar Cipher (substitution, ~50 BC)

**The idea:** Shift every letter forward by a fixed number. Shift of 3: A→D, B→E, C→F …

```
Plaintext:  H E L L O
Shift +3:   K H O O R
Ciphertext: K H O O R
```

Diagram of the wheel:

```
  Plain:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
  Cipher: D E F G H I J K L M N O P Q R S T U V W X Y Z A B C
          └──────────── shifted by 3 ────────────┘
```

**The key** is just the number (3). To decrypt, shift back by 3.

**Pros:** Trivially simple; good for teaching the *concept* of a key.
**Cons:** Catastrophically weak. Only 25 possible keys - you can try them all by hand in a minute (**brute force**). It also leaks letter patterns.
**Verdict:** Educational only. Never real security.

---

### 10.2 Breaking substitution: frequency analysis (~800 AD)

Even a *random* letter-substitution cipher (not just a shift - any A→?, B→?… mapping, ~4×10²⁶ keys) falls to one trick: **frequency analysis.**

In English, `E` is the most common letter, then `T`, `A`, `O`… So in the ciphertext, find the most common symbol - it's probably `E`. Match the frequency fingerprint and the message unravels.

```
English letter frequency (most common first):
E  T  A  O  I  N  S  H  R  D  L  U ...
████ ███ ███ ██ ██ ██ █ █ █ ...
```

**The lesson that shaped all modern crypto:** *a huge keyspace is not enough.* The cipher must not leak patterns. This is why modern ciphers aim for output that looks like pure random noise.

---

### 10.3 Vigenère Cipher (polyalphabetic, 1500s)

**The idea:** Use a *keyword* to apply *different* Caesar shifts to each letter, defeating simple frequency analysis.

Key `KEY` repeats across the message; each letter shifts by its key letter (K=10, E=4, Y=24):

```
Plaintext:  A T T A C K A T D A W N
Key (rep):  K E Y K E Y K E Y K E Y
Ciphertext: K X R K G I K X B K A L
```

**Pros:** Much stronger than Caesar; the same plaintext letter can map to different ciphertext letters, blurring frequencies. Unbroken for ~300 years ("le chiffre indéchiffrable").
**Cons:** The key *repeats*. Find the key length (Kasiski examination) and it collapses into several Caesar ciphers, each breakable by frequency analysis.
**Verdict:** A conceptual leap (polyalphabetic), but broken. Still educational gold.

---

### 10.4 The One-Time Pad (the only *unbreakable* cipher)

**The idea:** Vigenère, but the key is **truly random**, **as long as the message**, and **used only once**.

```
Plaintext:  1 0 1 1 0 0 1 0   (your message as bits)
Key (random):0 1 1 0 1 0 0 1   (random, same length, secret, used once)
XOR ───────────────────────
Ciphertext: 1 1 0 1 1 0 1 1
```

**Why it's unbreakable:** For any ciphertext, *every* possible plaintext of that length is equally likely - the ciphertext reveals literally nothing. This is mathematically proven (Shannon's "perfect secrecy").

**Pros:** Provably, perfectly secure. Nothing can break it.
**Cons:** Utterly impractical for most uses: the key must be as long as *all* data you'll ever send, truly random, shared securely in advance, and never reused. (Reusing a one-time pad *once* breaks it completely - a famous Soviet mistake exploited by the VENONA project.)
**Verdict:** The theoretical gold standard; used only in ultra-high-security niche cases. It proves the ceiling everything else approximates.

---

### 10.5 The great divide: Symmetric vs Asymmetric

Everything modern splits into two families. Understanding this split is the key to the whole chapter.

```
SYMMETRIC                          ASYMMETRIC (public-key)
─────────                          ───────────────────────
ONE shared secret key              A KEY PAIR: public + private
Same key locks & unlocks           Public locks, private unlocks
🔑 = 🔑                             🔓(public)  🔒(private)

Fast (great for bulk data)         Slow (great for small data / key exchange)
Problem: how do two strangers      Solves key distribution:
securely share the key?            publish your public key to the world
```

**The brilliant combination used everywhere (e.g., HTTPS):** use *slow asymmetric* crypto once to securely agree on a *fast symmetric* key, then use the symmetric key for all the actual data. Best of both.

---

### 10.6 Symmetric encryption: DES → AES

**DES (Data Encryption Standard, 1977):** The first modern standard. 56-bit key.
**Pros:** Historic, well-studied.
**Cons:** 56-bit key is now **far too short** - brute-forced in hours with modern hardware.
**Verdict:** Dead. "3DES" (running DES three times) extended its life but is also now deprecated.

**AES (Advanced Encryption Standard, 2001) - the modern workhorse.**
- Key sizes: **128, 192, or 256 bits.** AES-256 is the gold standard.
- Works on 128-bit blocks using multiple "rounds" of substitution and permutation (confusion + diffusion - exactly the lessons from §10.2).
- Hardware-accelerated in modern CPUs (AES-NI) → extremely fast.

**Pros:** Fast, battle-tested over 20+ years, no practical break, government/industry standard, hardware support.
**Cons:** Still faces the symmetric *key distribution* problem (solved by pairing with asymmetric). Must be used in a secure **mode**.
**Verdict:** The default for encrypting data at rest and in bulk. **Use AES-256-GCM** (see below).

**Critical detail - the MODE matters as much as the cipher:**
- **ECB (Electronic Codebook)** - encrypts each block independently. **Never use it.** Identical plaintext blocks produce identical ciphertext blocks, so patterns leak. (The infamous "ECB penguin": an encrypted image of a penguin is *still visibly a penguin.*)
- **CBC** - chains blocks together; better, but needs care (padding oracle attacks).
- **GCM (Galois/Counter Mode)** - the modern choice. It's **AEAD**: it both encrypts *and* authenticates, so you detect tampering automatically. **Prefer AES-GCM or ChaCha20-Poly1305.**

```
ECB (BAD):  pattern in → pattern out   🐧 → 🐧 (still a penguin!)
GCM (GOOD): looks like random noise + built-in tamper detection ✓
```

**ChaCha20-Poly1305:** a modern alternative to AES-GCM, excellent on devices without AES hardware (mobile). Used in TLS and WireGuard.

---

### 10.7 Asymmetric encryption: RSA, Diffie-Hellman, ECC

**RSA (1977):** The classic public-key system. Security rests on the difficulty of **factoring huge numbers** (multiply two giant primes together = easy; factor the result back = practically impossible).

```
You publish:   PUBLIC KEY  → anyone encrypts a message to you
You keep secret: PRIVATE KEY → only you can decrypt
(Also works in reverse for SIGNING - see §10.9)
```

**Pros:** Simple concept, widely supported, solves key distribution, enables digital signatures.
**Cons:** Slow; needs large keys (2048-bit minimum, 3072+ recommended) which grow over time; vulnerable to future quantum computers (§10.11).
**Verdict:** Still common, but the world is moving to ECC for efficiency.

**Diffie-Hellman (DH) key exchange:** Lets two people who have *never met* agree on a shared secret over a public channel, where an eavesdropper who sees everything *still* can't compute the secret.

```
Public analogy (paint mixing):
  Both agree on a public color   🟡
  Each adds a SECRET color       🟡+🔴(secret) ,  🟡+🔵(secret)
  They swap mixtures publicly     🟠 ↔ 🟢
  Each adds their secret again → both reach the SAME final color 🟤
  An eavesdropper saw 🟡 🟠 🟢 but can't un-mix to get 🟤
```

**Pros:** Elegant solution to key agreement; enables **forward secrecy** (below).
**Cons:** By itself doesn't authenticate (needs signatures to prevent MITM); classic DH is quantum-vulnerable.
**Verdict:** The backbone of modern secure sessions (as **ECDHE**).

**ECC (Elliptic Curve Cryptography):** Same goals as RSA/DH but based on elliptic-curve math. The win: **much smaller keys for the same security.** A 256-bit ECC key ≈ a 3072-bit RSA key.

**Pros:** Small keys, fast, less power/bandwidth - ideal for mobile and IoT. Now the preferred default.
**Cons:** Trickier to implement correctly (bad curves/implementations have failed); also quantum-vulnerable.
**Verdict:** The modern choice for key exchange (ECDHE) and signatures (ECDSA/Ed25519).

**Forward secrecy (why it matters):** With **ephemeral** key exchange (ECDHE), each session uses a fresh temporary key that's thrown away. So even if an attacker records all your encrypted traffic today *and* steals your private key years later, they **still can't decrypt the past sessions.** Modern TLS mandates this.

---

### 10.8 Putting it together: how HTTPS/TLS actually protects you

When you see the padlock, this happened in milliseconds:

1. **Certificate check** - the server proves its identity with a certificate signed by a trusted **Certificate Authority (CA)**. (This stops you talking to an impostor.)
2. **Key exchange (ECDHE)** - your browser and the server agree on a shared symmetric key, with forward secrecy. Nobody listening can derive it.
3. **Symmetric encryption (AES-GCM / ChaCha20)** - all your actual data flows encrypted and authenticated with that fast key.

```
[Asymmetric: verify identity + agree on a key]  →  [Symmetric: encrypt all the data, fast]
        RSA/ECDSA + ECDHE                                   AES-GCM / ChaCha20-Poly1305
```

That's the slow-establishes-fast pattern from §10.5, in production, a billion times a second.

---

## Part B - Hashing (integrity & passwords)

A **hash** takes any input and produces a fixed-size "fingerprint." It's **one-way** (can't reverse) and **deterministic** (same input → same output). Change one bit of input → the whole hash changes completely (**avalanche effect**).

```
"hello"      → 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c...
"hellp"      → 7a38efb6a63f9... (one letter changed → totally different)
```

**What makes a hash cryptographically strong:**
- **Preimage resistance** - given a hash, you can't find the input.
- **Collision resistance** - you can't find two different inputs with the same hash.
- **Avalanche** - tiny input change → totally different output.

### 10.9 General-purpose hash functions (for integrity & signatures)

| Algorithm | Status | Notes |
|-----------|--------|-------|
| **MD5** | ☠️ **Broken** | Collisions trivially producible. *Never* for security. OK only as a non-security checksum. |
| **SHA-1** | ☠️ **Broken** | Collision demonstrated (Google's "SHApocalypse", 2017). Retired. |
| **SHA-2** (SHA-256, SHA-512) | ✅ **Secure** | The current workhorse. Used in TLS, signatures, blockchains, file integrity. |
| **SHA-3** (Keccak) | ✅ **Secure** | Different internal design (sponge); a safe alternative/backup to SHA-2. |
| **BLAKE2 / BLAKE3** | ✅ **Secure & fast** | Modern, faster than SHA-2, excellent for file hashing. |

**Use case - file integrity:** A download site publishes the SHA-256 of a file. You hash your downloaded copy; if it matches, the file wasn't corrupted or tampered with.

**Pros of secure hashes:** fast, fixed-size, detect any change, enable signatures.
**Cons:** *Being fast is a problem for passwords* - see next.

---

### 10.10 Password hashing (a DIFFERENT job - slow on purpose)

**Do NOT hash passwords with SHA-256 alone.** General hashes are *fast*, which lets attackers try billions of guesses per second against a stolen database (Ch. 05). Password hashing needs to be deliberately **slow** and **salted**.

| Algorithm | Notes | Verdict |
|-----------|-------|---------|
| **bcrypt** | Slow, salted, decades of trust; cost factor adjustable | ✅ Good, widely used |
| **scrypt** | Slow + **memory-hard** (resists GPU/ASIC cracking) | ✅ Good |
| **PBKDF2** | Many iterations; FIPS-approved | ✅ Acceptable (use high iteration count) |
| **Argon2** (Argon2id) | Winner of the Password Hashing Competition; slow + memory-hard + tunable | ✅✅ **Best choice today** |

**Two extra ingredients:**
- **Salt** - a unique random value per password, stored alongside the hash. Defeats rainbow tables and ensures identical passwords hash differently. (Handled automatically by bcrypt/Argon2.)
- **Pepper** - an additional secret value kept *separately* (e.g., in an HSM/env var, not the DB). Even if the DB leaks, the pepper doesn't.

```
Storing a password, the right way:
  stored = Argon2id( password + salt , memory=high, time=high )   ; salt stored, pepper kept secret
Verifying:
  recompute with the same salt/params and compare in constant time
```

**Pros (Argon2/bcrypt):** make mass offline cracking economically infeasible.
**Cons:** intentionally use CPU/memory (that's the point); must tune parameters as hardware improves.

---

### 10.11 HMAC, digital signatures, and the quantum horizon

- **HMAC** - a hash combined with a secret key to prove a message's **integrity + authenticity** ("this came from someone who knows the key and wasn't altered"). Used in APIs, webhooks, tokens.
- **Digital signatures** (RSA, ECDSA, **Ed25519**) - sign with your *private* key; anyone verifies with your *public* key. Proves authorship and integrity, and is non-repudiable. Powers code signing, certificates, and secure updates.

**Post-Quantum Cryptography (PQC) - the coming shift:** Large quantum computers (not here yet, but anticipated) would break RSA, Diffie-Hellman, and ECC (via Shor's algorithm). Symmetric crypto (AES-256) and hashes (SHA-256) stay largely safe (just double key sizes). In 2024 NIST standardized the first PQC algorithms - **ML-KEM (Kyber)** for key exchange and **ML-DSA (Dilithium)** / SPHINCS+ for signatures. Migration is beginning now ("harvest now, decrypt later" is why: adversaries record encrypted data today to crack once quantum arrives).

**Pros of PQC:** resists quantum attacks.
**Cons:** newer, larger keys/signatures, still maturing; being deployed in hybrid mode (classical + PQC together) for safety.

---

## 10.11b The hard math problems crypto depends on - and the money to break them

Modern cryptography is a bet: *"breaking this requires solving a math problem that's too hard to solve in any reasonable time."* It's worth understanding **what those problems are**, and that there is **real money** - prizes, bounties, and black-market value - attached to cracking them. That's not trivia; it's the honest measure of how safe a system actually is.

### The problems your security literally rests on

| Crypto | The "hard problem" protecting it | If someone solves it efficiently… |
|--------|----------------------------------|-----------------------------------|
| **RSA** | **Integer factorization** - factor a huge number back into its two prime factors | All RSA (much of HTTPS, signatures, older systems) breaks |
| **Diffie-Hellman** | **Discrete logarithm problem** | DH key exchange breaks |
| **ECC (ECDSA/ECDHE)** | **Elliptic-curve discrete logarithm** | Modern key exchange & signatures break |
| **AES, SHA-2** | No known shortcut better than brute force | Would need a fundamental math breakthrough |

The deep question underneath *all* of this is **P vs NP** (below). If P = NP, essentially all of public-key cryptography could collapse.

### The real prizes and bounties

**1. The RSA Factoring Challenge (direct cash for breaking RSA-style math).**
RSA Laboratories publicly posted large numbers ("RSA-100", "RSA-250", … up to "RSA-2048") and offered **cash prizes** - tens of thousands of dollars - to anyone who could factor them. The point was to *measure* how hard factoring really is as computers improved.
- RSA-250 (829 bits) was factored in 2020 - it took roughly **2,700 core-years** of computing.
- Larger ones (like RSA-2048) remain **unfactored** to this day. The program formally ended and most prizes were withdrawn, but it stands as the clearest real-world demonstration: *"this is exactly how much effort breaking a key of size X costs."* That number is why we use 3072-bit RSA and beyond.

**2. The Millennium Prize - P vs NP ($1,000,000).**
The **Clay Mathematics Institute** offers **$1 million** for a proof (either way) of **P vs NP** - one of the deepest open problems in computer science. In plain English:

> *If a solution to a problem can be **checked** quickly, can it also be **found** quickly?*

- If **P = NP**: finding is as easy as checking → most encryption, password hashing, and public-key crypto become breakable. Civilization-level consequences.
- If **P ≠ NP** (what almost everyone believes, but nobody has proven): hard problems stay hard, and cryptography's foundation is safe.

No one has claimed the prize. The fact that it's *unproven* is a quiet reminder that modern crypto rests on a very well-tested **assumption**, not a theorem.

**3. Government standardization "competitions" (prestige + global adoption).**
NIST runs open, years-long public contests where cryptographers worldwide submit and *attack each other's* designs. The reward isn't cash - it's that your algorithm becomes the **world standard**:
- **AES** (2001) - Rijndael won against 14 rivals.
- **SHA-3** (2015) - Keccak won.
- **Password Hashing Competition** (2015) - **Argon2** won.
- **Post-Quantum Crypto** (2016–2024) - **Kyber/ML-KEM** and **Dilithium** won; *many submitted schemes were publicly broken during the contest* - which is the whole point: break it in daylight, not in production.

**4. Bug bounties (the everyday version - real money, right now).**
You don't need to break AES to get paid. Companies run **bug bounty programs** (via **HackerOne**, **Bugcrowd**, or their own) paying from hundreds to **hundreds of thousands of dollars** for responsibly-disclosed vulnerabilities - including crypto *misuse* (weak randomness, reused nonces, downgrade attacks, bad key storage). Apple, Google, Microsoft, and others pay the top amounts for critical findings.
- This is the **legal, ethical, lucrative** path for the offensive skills in this guide: find flaws, report them, get paid, build a career. Start on practice targets, then move to programs on HackerOne/Bugcrowd that explicitly invite testing.

**5. The dark side (why defense matters).**
Working exploits for unbroken systems have real black-market value - "zero-day" exploits and ransomware operations trade for large sums. That economic incentive is *why* attackers are persistent and well-funded, and why everything in this guide exists. The same skill pays far better, and sustainably, on the legal side.

**The takeaway:** Cryptography is safe not because breaking it is *impossible*, but because breaking it is *provably, measurably, expensively hard* - and the world keeps putting money on the table to test exactly how hard. When those costs drop (faster computers, new math, quantum), we upgrade the algorithms. That upgrade cycle is the living heart of the field.

---

## 10.12 The practical rules (memorize these)

- **Encrypt bulk data:** AES-256-**GCM** (or ChaCha20-Poly1305). Never ECB.
- **Key exchange / web:** ECDHE (forward secrecy) + certificates → TLS 1.3.
- **Hash for integrity:** SHA-256 / SHA-3 / BLAKE3. Never MD5 or SHA-1.
- **Hash passwords:** **Argon2id** (or bcrypt/scrypt) with salt. Never a plain fast hash.
- **Authenticate messages:** HMAC-SHA256 or a signature (Ed25519).
- **The golden rule:** **Never invent your own crypto.** Use vetted libraries (libsodium/NaCl, your platform's standard). Amateur crypto fails in subtle, catastrophic ways. Your job is to *use the right tool correctly*, not to build the algorithm.

➡️ Next: [11 - Blue Team & Incident Response](11-blue-team-ir.md)
