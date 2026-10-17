# 09 - Cloud, Containers & DevSecOps

Almost everything runs in the cloud now, and software ships continuously. The attack surface moved - so did the defenses. This chapter covers securing cloud infrastructure, containers, and the software pipeline itself.

---

## 9.1 The cloud shared-responsibility model (the thing everyone gets wrong)

Cloud security is **split** between provider and you:

- **The provider (AWS/Azure/GCP) secures the cloud** - physical data centers, hardware, the core infrastructure.
- **You secure what's *in* the cloud** - your configurations, data, access controls, and code.

**The #1 cause of cloud breaches is not the provider being hacked - it's customer misconfiguration.** You own that half, and that's where almost all incidents happen.

---

## 9.2 The big cloud risks (and fixes)

**1. Public storage buckets.** S3/Blob/GCS buckets accidentally set to public, exposing data to the whole internet.
- *Fix:* Block public access by default (AWS now does); scan continuously with cloud posture tools; least-privilege bucket policies.

**2. Over-permissive IAM (Identity and Access Management).** Users/roles with far more permissions than needed (`*:*` admin everywhere). One leaked key = total compromise.
- *Fix:* **Least privilege** rigorously. Use roles, not long-lived keys. Enforce MFA. Rotate credentials. Run **access analyzers** (AWS Access Analyzer) to find excess permissions.

**3. Leaked cloud keys.** Access keys committed to GitHub are found by bots within *minutes* and used to spin up crypto-mining or steal data.
- *Fix:* Never hardcode keys. Use a **secrets manager** (AWS Secrets Manager, HashiCorp Vault) or short-lived credentials (OIDC). Scan repos (TruffleHog). Set billing alerts.

**4. Exposed management surfaces & no logging.**
- *Fix:* Turn on **CloudTrail / Azure Monitor / GCP Audit Logs** everywhere - you can't investigate what you didn't log. Lock down admin consoles with MFA + IP allowlists.

**Real-world example - Capital One (2019):** A misconfigured web application firewall let an attacker reach cloud metadata and assume an over-permissioned role, exposing 100M+ records. Root causes: SSRF + excessive IAM permissions - both *customer-side* misconfigurations.

**Cloud security tools:** **ScoutSuite**, **Prowler**, **CloudSploit** (open-source posture scanners), **Pacu** (AWS exploitation framework for testing), plus native **CSPM** (Cloud Security Posture Management) services.

---

## 9.3 Container security (Docker)

Containers package an app with its dependencies. Risks:

- **Vulnerable base images** - you inherit every CVE in the image you build on.
  - *Fix:* Use minimal/official base images; **scan images** with **Trivy**, **Grype**, or Docker Scout; rebuild regularly.
- **Running as root inside the container** - if an attacker breaks out, they're root.
  - *Fix:* Run as a non-root user; drop Linux capabilities; read-only filesystems.
- **Secrets baked into images** - anyone who pulls the image gets them.
  - *Fix:* Inject secrets at runtime, never at build time.
- **The Docker socket** - mounting `/var/run/docker.sock` into a container is effectively root on the host.
  - *Fix:* Don't, unless you fully understand it.

---

## 9.4 Kubernetes security (the basics that matter)

Kubernetes orchestrates many containers. Key controls:
- **RBAC** - least-privilege access for users and service accounts (not `cluster-admin` for everything).
- **Network Policies** - by default pods can all talk to each other; restrict it (segmentation inside the cluster).
- **Pod Security Standards** - forbid privileged pods, host mounts, root.
- **Secrets** - use proper secret stores (K8s secrets are only base64 by default - not encryption).
- **Scan everything** - **kube-bench** (CIS benchmark checks), **kube-hunter**, Trivy.

---

## 9.5 DevSecOps - shifting security "left"

**The idea:** Don't bolt security on at the end - build it into every stage of development ("shift left"). Catching a flaw in code review costs pennies; catching it in production costs a breach.

**Security gates in a CI/CD pipeline:**

| Stage | Control | Example tools |
|-------|---------|---------------|
| Write code | IDE linters, secure coding | editor plugins |
| Commit | **Secret scanning** (block committed keys) | GitLeaks, TruffleHog |
| Build | **SAST** (Static Analysis - scans *source code* for flaws) | Semgrep, SonarQube, CodeQL |
| Dependencies | **SCA** (scan third-party libs for CVEs) | Snyk, Dependabot, OWASP Dependency-Check |
| Container | **Image scanning** | Trivy, Grype |
| Deploy | **IaC scanning** (scan Terraform/CloudFormation) | Checkov, tfsec, Terrascan |
| Running app | **DAST** (Dynamic Analysis - attacks the *running* app) | OWASP ZAP, Burp |
| Production | **Monitoring, WAF, posture** | SIEM, Cloudflare, CSPM |

**SAST vs DAST in one line:** SAST reads the blueprint for flaws; DAST shakes the finished building to see what falls off.

---

## 9.6 Supply-chain security

**What it is:** Attacking you by compromising something you *trust* - a dependency, a build tool, a vendor's update.

**Real-world example - SolarWinds (2020):** Attackers compromised SolarWinds' build system and inserted a backdoor into a legitimate, signed software update. 18,000 organizations - including US government agencies - installed the trojaned update automatically. They were breached by trusting a normal update.

**Real-world example - the npm/PyPI ecosystem:** Malicious packages with names similar to popular ones ("typosquatting"), or legitimate packages hijacked after a maintainer's account is phished, inject malware into thousands of projects.

**How to defend the supply chain:**
- **Pin and verify dependencies** (lockfiles, checksums, signatures).
- **Generate and review an SBOM** (Software Bill of Materials).
- **Sign artifacts** and verify signatures (Sigstore/cosign).
- **Vet new dependencies** before adding them; watch for typosquats.
- **Secure your own build pipeline** - it's a high-value target (SolarWinds' lesson).
- **Least privilege for CI/CD** - build systems often have powerful credentials.

➡️ Next: [10 - Cryptography](10-cryptography.md)
