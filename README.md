# Lost & Found — Centralized Belongings Recovery Platform

A modern, full-stack, responsive web application designed for universities, colleges, office campuses, public organizations, and communities to report, search, correlate, verify, and recover lost and found personal belongings.

---

## 🌟 Key Features

1. **Centralized Directory & Marketplace**
   - Search across all campus items with live keyword matching.
   - Filter by Type (Lost, Found, Returned), Category (Electronics, Wallet, Keys, Bags, Documents, Books, etc.), Campus Location, and Incident Date.
   - Zero-Pill clean typography and responsive visual cards.

2. **Automated & AI-Assisted Matching Engine**
   - Hybrid similarity engine combining rule-based heuristics (category matching, tokenized Jaccard overlap, campus zone proximity, and timestamp proximity) and optional Google Gemini (`gemini-3.8-flash`) semantic reasoning.
   - Clearly labels match percentages as system-generated estimates to preserve trust.
   - Instant notifications when counter-reports are detected.

3. **Secure Ownership Claim Verification**
   - Non-invasive question prompts (distinguishing marks, internal pocket contents, exact loss coordinates).
   - Strict privacy safeguards: **never** solicits or reveals passwords, PINs, OTPs, or full credit card numbers.
   - Structured claim lifecycle: `Pending` &rarr; `Under Review` &rarr; `Approved` / `Rejected` &rarr; `Completed`.

4. **Safe In-App Communication**
   - Sandboxed in-app messaging keeps user emails and phone numbers private during initial coordination.

5. **Campus Administration & Moderation Console**
   - Comprehensive dashboard analytics: Total Users, Lost vs. Found distribution, Active Matches, Claims, and Recovery Rate.
   - User account management (suspend, activate, audit).
   - Listing moderation (flag suspicious entries, resolve disputes, delete inappropriate listings).
   - Claim adjudication with custom security feedback notes.
   - 1-click Demo Data Reset for seamless demonstration.

6. **Fast 1-Click Demo Personas**
   - **Sarah Connor (Student / User A)**: Preloaded with lost wallet and student ID reports.
   - **David Miller (Finder / User B)**: Preloaded with turned-in wallet and smartphone reports.
   - **Campus Administrator**: Complete administrative control, metrics, and claim queue.

---

## 🏗️ Project Architecture

```
lost-and-found/
├── database/
│   ├── schema.sql              # Relational SQL DDL for PostgreSQL / MySQL
│   └── seed.sql                # Seed data with realistic sample items
├── data/
│   └── database.json           # File-backed ACID transactional JSON data store
├── server/
│   ├── db.ts                   # Database models, persistence, and statistics engine
│   ├── matcher.ts              # Rule-based & Gemini AI similarity evaluator
│   └── routes/
│       ├── admin.ts            # Admin analytics, user moderation, and dispute resolution
│       ├── auth.ts             # Registration, login, demo switcher, and profile
│       ├── claims.ts           # Ownership claim submission and review
│       ├── contact.ts          # Safe in-platform messaging
│       ├── items.ts            # Items CRUD and search
│       ├── matches.ts          # Potential match querying and on-demand pairing
│       └── notifications.ts    # User notification center
├── src/
│   ├── assets/images/          # High-fidelity photography for items and hero banner
│   ├── components/             # Reusable UI components (Navbar, ItemCard, Modals, Footer)
│   ├── context/                # AuthContext and NotificationContext
│   ├── pages/                  # 12 complete page views
│   ├── services/api.ts         # Type-safe client API service
│   ├── types/                  # TypeScript interface declarations
│   ├── App.tsx                 # Main application controller
│   └── main.tsx                # React DOM entry point
├── server.ts                   # Express server mounting Vite middleware
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Environment Variables
Create a `.env` file based on `.env.example`:

```env
# Optional: Enables Gemini AI semantic similarity and safe claim questions
GEMINI_API_KEY="your_gemini_api_key_here"

# Application URL
APP_URL="http://localhost:3000"
```

### 2. Development Mode
Run the unified Express + Vite development server on port 3000:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 3. Production Build
To build and start for production:

```bash
npm run build
npm start
```

---

## 🔒 Security & Responsible Design Highlights

- **Password Hashing**: Passwords are securely hashed with salted SHA-256 before persistence.
- **Privacy Preservation**: User phone numbers and personal emails are never publicly exposed on item cards or search results.
- **No Automatic Ownership**: AI and algorithms only suggest candidates. Final ownership verification is strictly performed via the claim review workflow.
