# PingME Lifeline — 2-Minute Demo Video Script & Storyboard

> **Event:** PingME Hackathon ("Build the Super App")  
> **Team:** The Callback  
> **Deliverable:** 2-Minute Backup Demo Video (Submission Requirement 3)  
> **Format:** Realistic, clean documentary-style product walkthrough (no hyper-realistic CGI, no over-animation).

---

## Story Synopsis
Rohan (24) is commuting to work when his motorcycle skids at a busy intersection. He is dazed on the pavement. His smartphone is locked in his jacket. Pooja, an everyday bystander, rushes to help. She notices a PingME QR tag affixed to his helmet. In under 90 seconds, Rohan's vital blood group and severe penicillin allergy are identified, an ambulance is dialed, his family receives live GPS telemetry, and his spouse responds with an arrival ETA—all with **zero phone numbers exposed**.

---

## Second-by-Second Video Script (0:00 – 2:00)

| Timestamp | Visual Action (On-Screen) | Voiceover Narration | Sound & Audio Cues |
|---|---|---|---|
| **0:00 – 0:15** | **The Hook & Problem:** Over-the-shoulder shot of a simulated road incident. Rohan is sitting on the curb, disoriented. His phone screen is cracked and locked with a numeric PIN. Pooja approaches to help. | *"In India, over 150,000 lives are lost annually in road emergencies. The biggest barrier during the Golden Hour isn't medical care—it's communication. Victims are dazed, their phones are locked, and bystanders don't know who they are, what allergies they have, or whom to call without invading their privacy."* | Ambient city traffic sounds, gentle tension tone. |
| **0:15 – 0:30** | **The Discovery:** Close-up on Rohan's motorcycle helmet. A clean, waterproof PingME QR tag is visible (`LIFE-9021`). Pooja pulls out her normal smartphone and opens her default camera app. | *"Enter PingME Lifeline. On Rohan's helmet is a PingME QR tag. No app download. No sign-up. Anyone with a normal smartphone camera can scan it instantly."* | Camera focus chime, subtle digital beep. |
| **0:30 – 0:45** | **The Public Scan Screen:** Screen recording of `/t/LIFE-9021`. The medical card loads in under 400ms: Photo, Name, giant `O+` Blood Group stamp, and Penicillin Allergy badge. Zero phone numbers are visible. | *"In under half a second, critical life-saving vitals appear: Rohan's blood group O-positive, his severe penicillin allergy, and an asthma caution. Crucially, Rohan's personal phone number is never exposed to strangers."* | Soft acoustic notification tone. |
| **0:45 – 1:00** | **Bystander Dispatch:** Pooja taps the prominent red **"Call 108 Ambulance"** button, then taps **"I'm with them"**. She selects **"Accident"**, types *"Conscious, road skid"*, and permits the browser Geolocation API. Tap: *"Submit Incident"*. | *"Pooja can trigger an ambulance via the direct 108 button, and taps 'I'm with them'. The browser's Geolocation API captures the exact GPS coordinates and transmits an encrypted distress beacon to Rohan's family."* | Clean tactile click, haptic vibration sound. |
| **1:00 – 1:20** | **Family Real-Time Alert:** Cut to a home office. Priya (Rohan's spouse) is working on her laptop. The **Family Dashboard** chimes with an audible emergency alert. The screen reveals a live Leaflet OpenStreetMap pin and the 3 nearest emergency hospitals queried via the Overpass API. Priya selects ETA **12 mins** and taps **"On My Way"**. | *"Miles away, Rohan's family console rings live. Driven by Supabase Realtime, Priya sees the exact location pin and nearby trauma facilities. She taps 'On My Way' with a 12-minute ETA."* | Real-time dual-frequency emergency chime (Web Audio API). |
| **1:20 – 1:35** | **Live Helper Feedback Loop:** Cut back to Pooja's phone screen. Without refreshing the page, the screen dynamically transitions to: *"Family is coming. Estimated arrival: 12 minutes."* Pooja taps *"Connect via PingME Relay"* to speak to Priya through a masked virtual line. | *"Instantly, Pooja's phone updates live: 'Family is coming, ETA 12 minutes'. They connect via PingME's virtual voice relay—neither party ever sees the other's real phone number."* | Success confirmation chime, dial tone. |
| **1:35 – 1:50** | **Crisis Mode & Paramedic Unlock:** Split-screen montage. Left: A relief camp rescuer quickly scanning tags in bulk, marking citizens `Safe`, `Injured`, or `Admitted`. Right: An ER doctor enters passcode `HOSP-1234` to unlock Rohan's full clinical surgical history. | *"The same tag adapts everywhere. In disaster relief shelters, verified rescuers use Crisis Mode to bulk-triage hundreds of displaced citizens. At the hospital, authorized trauma doctors enter their credentials to unlock confidential clinical records."* | Subtle data sync whoosh. |
| **1:50 – 2:00** | **PingME Pass & Closing Statement:** Quick demonstration of PingME Pass at a coffee counter: customer shows QR for e-bill, masked token `#PM-4821` is transmitted. Cut to PingME Lifeline logo on warm cream. | *"And with PingME Pass, people carry their QR every day for private checkout at cafes and stores. One tag for everyday convenience. A lifeline when it matters most. PingME Lifeline: A QR that speaks for you when you can't."* | Warm brand chord resolution. |

---

## Filming & Demo Recording Checklist

### Screen Recording Setup
1. **Device 1 (Mobile Browser):** Open Chrome/Safari on a smartphone to `http://localhost:3000/t/LIFE-9021`.
2. **Device 2 (Desktop/Laptop):** Open Chrome on desktop to `http://localhost:3000/family/dashboard`.
3. **Interactive Simulator:** You can also run the built-in walkthrough player at `http://localhost:3000/demo`.
4. **Audio:** Enable system audio recording to capture the dual-tone chime and haptic feedback.

### Key Visual Directives
- **No CGI / Over-Animation:** Keep cuts natural and purposeful. Use real phone screens and screen captures rather than floating 3D graphics.
- **Color Grading:** Align lighting and visuals with PingME's warm cream (`#FEF9EC`) and golden yellow (`#EE9C18`) aesthetic.
- **Pacing:** Each scene lasts strictly between 15 to 25 seconds to respect the hackathon's hard 2-minute deadline.
