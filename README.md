# RetroVibe 🌀 — AI Agile Retrospective Facilitator

RetroVibe is an AI-powered facilitator that helps Agile teams uncover emotional bottlenecks, build psychological safety, and improve team health through data-driven insights. Paste in a meeting transcript, get an emotional health score, and receive targeted exercises to fix what's actually wrong — not just another generic retro template.

---

## ✨ Features

| Feature | What it does |
|---|---|
| **Emotional Analysis** | Analyzes meeting transcripts to detect frustration, anxiety, burnout, and conflict patterns. |
| **Smart Recommendations** | Suggests targeted team-building exercises based on your team's personality profile and detected emotional bottlenecks. |
| **Vibe Tracking** | Tracks emotional health trends over time via weekly check-ins. |
| **Impact Measurement** | Measures the efficacy of team exercises by comparing team "vibe" before and after implementation. |

---

## 🧱 Tech Stack

- **Frontend** — Vanilla JavaScript, CSS, HTML5
- **Data Visualization** — [Chart.js](https://www.chartjs.org/) for tracking team vibe trends
- **Persistence** — Browser `localStorage` (no backend database required)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine

### Installation
```bash
# Clone this repository
git clone <your-repo-url>

# Navigate into the project folder
cd <folder-name>

# Start the local server
node server.js
```

Then open your browser to:
```
http://localhost:8085/
```

---

## 📖 Usage

1. **Analyze** — Paste your meeting transcript into the "Analyze" section to generate an emotional health score.
2. **Configure** — Set up your team's personality profile so recommendations are tailored to how your team actually works.
3. **Check In** — Log regular vibe check-ins to build a trend line of team health over time.
4. **Measure** — Compare "before and after" vibe scores to see whether an exercise actually moved the needle.

---

## 🗺️ Roadmap

- [ ] Export vibe history as CSV/PDF
- [ ] Multi-team / workspace support
- [ ] Integrations with Slack, Zoom, or Google Meet transcripts

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](../../issues) if you'd like to help out.

## 📄 License

Specify your license here (e.g. MIT).
