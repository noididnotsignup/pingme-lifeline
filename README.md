# PingME Lifeline — "A QR that speaks for you when you can't."

> **PingME Hackathon ("Build the Super App")**  
> **Team:** The Callback  
> **Master Design Implementation:** Production-grade safety technology frontend built with Next.js 14, Tailwind CSS, Supabase PostgreSQL & Realtime, Leaflet, and OpenStreetMap.

---

## 1. Design Vision & Aesthetics ("Alert but Soothing")

The interface communicates three principles:
- **Trust:** Blue represents trust, navigation, and primary actions (`#145DA0`, `#0B2545`, `#2F80C9`).
- **Urgency:** Genuine emergency actions and critical alerts use Emergency Red (`#E5484D`) with 52px+ touch targets.
- **Calmness:** Fresh Green (`#20A464`), Soft Mint (`#E8F7EF`), and Light Blue (`#F0F6FC`) backgrounds maintain composure during stressful events.

---

## 2. Complete Application Structure & Routes

| Section | Route | Purpose & Key Features |
|---|---|---|
| **Public Landing Page** | [`/`](http://localhost:3000/) | Hero with smartphone mockup, 3-step process, Three Modes overview (Everyday, Crisis, Official), and privacy safeguards. |
| **Emergency QR Scan Page** | [`/t/[tagCode]`](http://localhost:3000/t/LIFE-9021) | **Highest priority screen:** Public, zero-login. Displays blood group stamp, allergies, conditions, large Call 108 button, "I'm with them" distress modal, and live updates when family responds. |
| **Family Dashboard** | [`/family/dashboard`](http://localhost:3000/family/dashboard) | Professional console with sidebar, active emergency alerts, Leaflet OpenStreetMap pin, Overpass API nearby hospitals, and **"On My Way"** ETA responder. |
| **Owner Profile & Tags** | [`/owner/profile`](http://localhost:3000/owner/profile) | Citizens manage medical vitals, toggle active tags (Helmet, Wristband, Backpack card), preview & download printable QRs. |
| **Rescuer Crisis Hub** | [`/rescuer/dashboard`](http://localhost:3000/rescuer/dashboard) | Shelter staff bulk-scan victims, update health status (`Safe` / `Injured` / `Admitted`), and manage a searchable camp ledger. |
| **Official Dashboard** | [`/official/dashboard`](http://localhost:3000/official/dashboard) | Verified hospital & police staff enter passcode (`HOSP-1234`) to unlock full clinical records, review statutory audit logs, and access restricted identification protocols. |
| **Demo Persona Switcher** | [`/auth`](http://localhost:3000/auth) | 1-click role switcher for hackathon judges to evaluate as Helper, Owner, Family, Rescuer, or Official. |
| **PingME Pass** | [`/pass`](http://localhost:3000/pass) | Everyday checkout concept screen: share masked token (`#PM-4821`) with shops for e-bills and loyalty without exposing phone numbers. |

---

## 3. The Core User Journey (Judge Demo Walkthrough)

1. **Step 1: Open the Public Scan Page**  
   - Visit [`/t/LIFE-9021`](http://localhost:3000/t/LIFE-9021) (or click **"Phone QR"** in the top navigation to scan with a physical phone camera).
   - Notice: No login or app required. Blood group (`O+`), penicillin allergy, and asthma condition are instantly readable in under 500ms.
   - Zero phone numbers are visible.
2. **Step 2: Helper Reports Distress**  
   - Tap **"I'm with them"** $\to$ select **Accident** $\to$ browser Geolocation API acquires coordinates $\to$ tap **"Submit Incident"**.
   - Helper sees: *"Family Has Been Notified"* with Reference ID `#INC-XXXX`.
3. **Step 3: Family Console Receives Real-Time Alert**  
   - On a second tab or device, open [`/family/dashboard`](http://localhost:3000/family/dashboard).
   - The alert rings live with an audio chime, showing the exact location pin and nearest trauma hospitals within 5km.
4. **Step 4: Family Responds with ETA**  
   - Tap **"On My Way"** $\to$ select **12 mins**.
   - The helper's screen updates live: *"Family is coming. Estimated arrival: 12 minutes."*

---

## 4. Test Seed Tags

- `LIFE-9021`: **Rohan Sharma** (24, O+, Vehicle Helmet Tag, Asthma & Penicillin Allergy)
- `LIFE-4412`: **Sunita Verma** (68, B+, Senior Wristband, Early Dementia & Diabetes)
- `LIFE-7703`: **Aarav Patel** (8, A+, Backpack ID Card, Severe Nut Anaphylaxis)
- **Doctor / Hospital PIN:** `HOSP-1234`
- **Ambulance Dispatch Line:** `108`

---

## 5. Local Setup & Execution

```bash
cd "C:\Users\Yahvi\.gemini\antigravity\scratch\pingme-lifeline"
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
