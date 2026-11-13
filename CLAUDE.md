# PROJECT CONTEXT: PingME Lifeline (Team "The Callback")

## 1. The Hackathon
- **Event:** PingME Hackathon, "Build the Super App". 12 hours, teams of 2–4 college students.
- **Company:** PingME (PINGIFF LLP), plzpingme.com. Live product is QR tags on vehicles, luggage and personal items. Anyone scans with a phone camera (no app, no login) and alerts the owner — **the owner's phone number is never shown**.
- **The Core Rule:** Idea must start from the PingME QR tag and grow outward from it.
- **Judging Criteria:**
  - Thinking/insight: 25%
  - Market research: 20%
  - **Working prototype: 25%** (THIS PROJECT)
  - Fit with PingME: 15%
  - Pitch clarity: 10%
  - Originality: 5%
- **Prototype Minimum Bar:**
  - One core user flow works end to end.
  - Data is stored and updated in a database, not hard-coded.
  - Runs live during judging.
  - Team can explain every part of the code.
  - Full marks = a judge can use it **without anyone guiding them**.

---

## 2. The Idea: PingME Lifeline
**Tagline:** "A QR that speaks for you when you can't."

**One-line Pitch:** We help families and first responders reach the right person quickly during an emergency by using the PingME QR tag as an emergency card that anyone can scan, without the owner's phone number being shown.

### Three Modes, One Tag:
1. **Everyday:** A bystander helps one person (Accident / Unwell / Lost).
2. **Crisis:** Verified rescuers scan tags in bulk at relief camps or triage zones.
3. **Worst Case:** Police/hospital identify a deceased or unconscious person with dignity.

---

## 3. Features Roadmap

### P1: Must Work End-to-End (The Core Demo)
1. **Scan page (`/t/[tagCode]`):** Public, zero login.
   - Name, photo, blood group badge, allergies, conditions, language.
   - Big prominent **Call 108** action (`tel:108`).
   - **NO PHONE NUMBERS DISPLAYED ANYWHERE.**
   - Helper taps **"I'm with them"**, selects situation (`Accident` / `Unwell` / `Found Lost`), adds optional note, browser Geolocation captures coordinates, incident is created.
2. **Family dashboard (`/family`):** Family receives the alert **in real time**:
   - Situation, time, live status indicator.
   - Leaflet + OpenStreetMap pin.
   - Nearby hospitals list (Overpass API + offline fallback).
   - Family taps **"On my way"** and enters ETA.
3. **Helper page live updates:**
   - Real-time status update: *"Family is coming, ETA 12 min"*.
   - Incident lifecycle transitions: `open` → `acknowledged` → `resolved`.

### P2: Crisis Mode & Privacy
4. Rescuer quick-scan (`safe` / `injured` / `admitted`) with camp directory.
5. Masked contact simulation + tiered access (Doctor/Hospital code e.g. `HOSP-1234` unlocks full medical info) + scan audit log.

### P3: Official Mode & PingME Pass
6. Restricted official identification & deceased protocol.
7. Merchant privacy pass ("One QR, you decide who sees what").

---

## 4. Tech Stack & Architecture
- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Design System:** Elevated Taste Skill + Awesome DESIGN.md specification
- **Database:** Supabase (PostgreSQL, Realtime, RLS) + Resilient Client Seed Engine
- **Mapping:** Leaflet + OpenStreetMap + Overpass API
- **QR Generation:** `qrcode` library

---

## 5. Security & Privacy Rules
- **Zero Raw Phone Numbers:** Phone numbers must never appear in any client UI or public scan endpoint.
- **Synthetic Data Only:** Demo uses dummy profiles and simulated hospital coordinates.
- **Resilient Realtime:** Realtime state synchronization between bystander and family dashboard.
