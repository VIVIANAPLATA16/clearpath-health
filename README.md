# ClearPath Health 🚀
### Intelligent Medical Authorization Platform Powered by AI Agents

> **Track:** Track 1: UiPath Maestro Case Management Case Study  
> **Open Source License:** MIT  
> **Application Language:** Spanish (Targeting the Colombian Healthcare System)  
> **Documentation Language:** English (For Judging Evaluation)

---

## 📌 Project Overview & The Business Problem

In Colombia, the healthcare system is facing an unprecedented crisis. Over **700 health-related lawsuits (tutelas) are filed every single day**, mostly triggered by severe delays in manually processing medical authorizations. Health Insurance Providers (EPS) have accumulated a crushing debt of **$32.9 billion**, pushing many toward mandatory liquidation. 

The core bottleneck isn't the doctors; it is the slow, repetitive, and administrative manual auditing workflow required to approve complex medical procedures.

### The Solution: ClearPath Health
**ClearPath Health** is an enterprise-grade AI agent platform built on **UiPath Maestro** that automates the medical service authorization workflow in seconds. By orchestrating a hybrid network of low-code automation, intelligent document processing (IDP), and generative AI reasoning (Gemini 2.5 Flash), the platform instantly analyzes clinical pertinence. 

* **The Business Impact:** Eliminates avoidable health lawsuits, drastically reduces EPS operational costs, and ensures patients receive life-saving medical responses in minutes instead of weeks.
* **Scalability:** Built as a multi-tenant SaaS architecture designed to scale seamlessly across Latin America (Mexico, Brazil, Chile).

---

## ⚙️ UiPath Platform & Architecture Blueprint

ClearPath Health leverages the **UiPath Automation Cloud** ecosystem as the core governance, orchestration, and execution layer.

### 🧩 Core UiPath Components Used:
* **UiPath Maestro (Case Management):** Acts as the master orchestrator. It manages the lifecycle of each authorization request through a dynamic, stateful workflow: `RECEIVED → READING → VERIFICATION → AI ANALYSIS → DECISION`.
* **UiPath Document Understanding (IDP):** Digitizes, structure-parses, and extracts clinical metadata from physical or digital medical orders/prescriptions submitted by clinics.
* **Human-In-The-Loop (UiPath Action Center):** Implements strict business governance. If a case falls under exception rules, Maestro pauses execution and routes it to a human medical auditor via an interactive panel, ensuring safety and compliance.

### 🤖 Multi-Agent Orchestration Flow:
1. **Agent 1: Clinical Data Reader (UiPath IDP)** -> Extracts patient data, CIE-10 diagnosis codes, and requested procedures.
2. **Agent 2: Coverage Verifier (UiPath Workflows)** -> Queries the EPS benefits registry database to validate plan coverage.
3. **Agent 3: Clinical Analyst (Gemini 2.5 Flash)** -> Evaluates clinical pertinence by comparing medical history with the request, calculating a **Pertinence Score (0-100)**.
4. **Agent 4: Response Generator (UiPath Document Generation)** -> Dynamically compiles the legal, fully traceable PDF authorization document.

### 📈 Business Logic & Exception Handling:
* **Score >= 70:** High clinical pertinence. The case triggers an **`AUTO-APROBADO`** state. The PDF is generated, signed, and closed automatically.
* **Score < 70:** Potential risk or insufficient justification. The case triggers a **`REVISIÓN HUMANA`** exception state. It escalates immediately to the Medical Auditor Dashboard for expert review.

---

## 🚀 DECLARATION: BONUS POINTS CLAIM (AI Coding Agents)

> **ATTENTION REVIEWERS:** This project fully qualifies for the **2 Bonus Points** under the *UiPath for Coding Agents* criteria.

### 🛠️ AI Tools Utilized:
* **v0.app & Next.js 16 AI Generation:** Used for designing, scaffolding, and composing the ultra-premium frontend interface, following a strict "Luxury Fintech" aesthetic inspired by *wompi.com*.
* **Claude Code / Cursor Composer:** Used to speed up component architecture, handle state mutations for real-time processing simulation, and ensure hydration and Next.js routing compatibility.

### 📂 Verifiable Evidence of AI Collaboration:
To verify the substantial and meaningful integration of coding agents in this solution, please review the interaction logs and development sessions attached in the repository:
* 📁 **`/ai-agent-logs/logs.txt`** (Terminal log and generation prompts history)

---

## 📦 Local Setup & Installation Guide

Follow these steps to run the interactive Next.js 16 web application demo locally.

### Prerequisites:
* Node.js 18.x or higher
* npm or pnpm

### Steps:
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/VIVIANAPLATA16/clearpath-health.git](https://github.com/VIVIANAPLATA16/clearpath-health.git)
   cd clearpath-health