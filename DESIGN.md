# PingME Lifeline — DESIGN.md
> *Anti-Slop Emergency Design System & Aesthetic Contract*  
> *Aligned with official PingME brand identity (plzpingme.com) & Team The Callback*

---

## 1. Design Direction: "The Tactical Lifeline"
PingME Lifeline uses the official **PingME warm golden yellow (`#EE9C18`)** and **light warm cream (`#FEF9EC`)** brand palette seen on [plzpingme.com](https://plzpingme.com/). It balances brand recognition with mission-critical emergency clarity:
- **Golden Yellow (`#EE9C18`)**: Primary brand identity, navigation active states, high-visibility "I'm with them" action buttons.
- **Warm Cream Canvas (`#FEF9EC`)**: Calming, soothing background that reduces cognitive fatigue during stressful emergencies.
- **Emergency Red (`#E5484D`)**: Reserved strictly for genuine emergency triggers (Call 108, Blood Group stamp, open alerts).
- **Fresh Green (`#20A464`)**: Safe, verified, acknowledged, and resolved health states.
- **Deep Obsidian / Charcoal (`#1C1917`)**: High-contrast text and dark command surfaces.

---

## 2. Color System & Design Tokens

| Token | Hex Value | Semantic Role in UI |
|---|---|---|
| `brand-primary` | `#EE9C18` | Official PingME golden yellow; main CTAs, active pills, logo. |
| `brand-dark` | `#D6880D` | Rich golden amber hover states. |
| `brand-tint` | `#FDF2D6` | Soft warm yellow badge and pill backgrounds. |
| `brand-bg` | `#FEF9EC` | Official PingME warm cream viewport background. |
| `brand-border` | `#EADFC7` | Warm hairline separators and card outlines. |
| `brand-navy` | `#1C1917` | Deep warm charcoal text and header containers. |
| `emergency-red` | `#E5484D` | Call 108 Ambulance, Blood Group Stamp, open emergency beacon. |
| `fresh-green` | `#20A464` | Verified status badges, safe rescuer markers, confirmed alerts. |
| `fresh-mint` | `#E8F7EF` | Soft mint alert background containers. |
| `text-main` | `#1C1917` | High WCAG AAA contrast body and headline typography. |
| `text-secondary`| `#78716C` | Warm stone secondary metadata and telemetry. |

---

## 3. High-Stakes Ergonomics
1. **52px+ Thumb-Zone Touch Targets:** Emergency call and bystander alert buttons are sized for high physical certainty.
2. **500ms Visual Hierarchy:** Blood group, allergies, conditions, and the 108 call button are readable in under 500ms.
3. **Zero Phone Number Leakage:** Call connections route through PingME's virtual relay with zero personal data leakage.
