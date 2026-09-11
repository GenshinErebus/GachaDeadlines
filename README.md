# GachaDeadlines ⏳

A clean, responsive, and matrix-themed countdown dashboard for tracking time-limited events. This project is strictly limited to 9 specific gacha games.

**Live Site:** https://genshinerebus.github.io/GachaDeadlines/

## Supported Games 🎮

The dashboard exclusively tracks countdowns for the following titles:

`Genshin Impact · Honkai: Star Rail · Zenless Zone Zero · Wuthering Waves · Reverse: 1999 · Duet Night Abyss · Arknights: Endfield · Neverness to Everness`

## Key Features 🚀

### ⏱️ Event & Banner Countdowns
- Live countdown timers (days / hours / minutes / seconds) for every tracked event
- Automatic color-coded urgency states: **Active** → **Warning** (< 7 days) → **Urgent** (< 2 days, blinking) → **Expired**
- Overview stats per game: *Active Events* and *Ending Soon* counters
- Golden banner styling to visually highlight limited character & weapon banners

### 🌍 Server Region Selector
- Switch between **ASIA / EUROPE / AMERICA** server regions
- Countdown end times and displayed dates automatically adjust to the selected region's daily reset offset
- Region choice is saved in `localStorage` and restored on the next visit

### 🔄 Daily Reset Countdown
- Dedicated card showing the time until the next daily server reset for each game (per-region reset times defined in UTC)
- Cyan-themed reset card, refreshed every second

### 🔧 Maintenance Tracker
- Displays upcoming maintenance windows, active downtime, or "no data" state
- Live countdown to maintenance start / end
- Region-aware logic (e.g. Arknights: Endfield EU & NA share one server)

### ☀️ Light / Dark Mode
- Toggle between the classic Matrix dark theme and a readable light theme
- Preference persists via `localStorage`
- Urgency, banner, reset and maintenance colors are carefully adapted for light mode

### 🔍 Tile Zoom Controls
- Scale the event card grid from **50 % to 200 %** with + / − buttons
- Zoom level persists across sessions

### 🐞 Feedback & Report Center
- Built-in modal to report missing events, bugs, or feature requests
- Two submission paths:
  - **Send via E-Mail Client** (`mailto:` – uses your e-mail address)
  - **Send Directly** (FormSubmit API – anonymous, no e-mail required)
- Auto-fills the currently selected game and server region
- Success / error feedback announced to screen readers via `aria-live`

### 📊 Status Bar & Extras
- Fixed footer with live UTC server clock, system status, and stats page link
- Click the timestamp to open the built-in **Deadline Calculator**
- "Updated" stamp automatically reads the real `Last-Modified` date from the server
- Visit tracking via a Cloudflare Worker (fire-and-forget, no cookies)

### ⌨️ Keyboard Shortcuts
- `Ctrl + R` — reload the page
- `Ctrl + S` — export the full event database as JSON

### 📱 Fully Responsive
- Optimized desktop, tablet and mobile layouts
- Extra breakpoints for ultra-small screens (≤ 375 px)

### 🔍 SEO & Accessibility
- Static fallback text for crawlers, meta description & keywords
- Web app manifest, favicons and theme icons (installable)
- Screen-reader friendly: hidden `h1`, `aria` labels, focus outlines, live regions

## Project Structure 📁

```
index.html          # Main dashboard
Calculator.html     # Deadline calculator
research.html       # Research/info page
style.css           # Dashboard styling (Matrix theme + light mode)
script.js           # Event database & countdown logic
Cstyle.css          # Calculator styles
Rstyle.css / Rscript.js  # Research page assets
assets/ (icons, avatar)
.github/workflows/  # CI automation
.nojekyll
CONTRIBUTING.md
```

## Contributing 🤝

We welcome community contributions to keep event timers accurate and up-to-date!

⚠️ **Important Note:** This repository only accepts data updates for the **9 predefined games** listed above. Pull Requests trying to add new, unsupported games will not be merged.

### Quick Workflow

1. Fork the repository
2. Update the event database in `script.js` (add/adjust `endDate` entries)
3. Submit a Pull Request — banner/event IDs must match the existing schema

📜 **Contribution Guidelines:** Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for data schemas and instructions.

### 🐛 Found a wrong timer?

Use the **REPORT** button directly on the site, or open an issue here on GitHub.

## License 📄

All rights reserved. The source code is publicly visible for community contributions and review, but hosting independent copies or distributing modified versions without explicit permission is strictly prohibited.
