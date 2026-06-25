<img width="951" height="894" alt="resumeAi cover letter" src="https://github.com/user-attachments/assets/9ed16eed-0f19-4c9e-98cf-ccd8fb9a609e" />

# 🎯 AI Resume Optimizer and Cover letter

> **Make your resume fit the job.**
> Paste your resume and a job description — get a match score, keyword gaps, stronger bullets, missing skills, a rewritten resume, and a tailored cover letter. All in seconds.

![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat&logo=react)
![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-14B8A6?style=flat)
![Speed Optimized](https://img.shields.io/badge/Speed-Optimized-F59E0B?style=flat)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## Features

### Resume Optimizer
- **Upload or paste your resume** — supports PDF and plain text
- **ATS keyword matching** — instantly see what's missing vs. what you have
- **Match score (0–100)** — broken down across 4 categories: keyword match, relevance, impact, and formatting
- **Bullet point rewrites** — AI rewrites weak bullets into strong, impact-driven ones
- **Missing skills detection** — flags qualifications you haven't highlighted
- **One-click auto-apply** — applies all improvements directly to your resume
- **Copy to clipboard** — grab your updated resume instantly

### Cover Letter Generator
- Generates a tailored, professional cover letter from your resume + job description
- Fully editable after generation
- Regenerate anytime with one click
- Copy to clipboard instantly

### Speed Optimized
- PDF extraction powered by **Claude Haiku** for near-instant parsing
- TXT files load with **zero API calls**
- Input trimming keeps token usage low and responses fast
- Live loading indicators so you always know what's happening

---

## Getting Started

This app runs entirely in the browser using the [Anthropic Claude API](https://www.anthropic.com).

### Prerequisites
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Run locally

```bash
git clone https://github.com/sarahsair25/ai-resume-optimizer.git
cd ai-resume-optimizer
npm install
npm start
```

Open `http://localhost:3000` in your browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React / Next.js 14, Tailwind CSS |
| AI Analysis | Claude Sonnet / GPT-4o-mini / Gemini |
| PDF Parsing | pdf-parse / Claude Haiku |
| Cover Letter | Claude Sonnet / GPT-4o-mini / Gemini |
| Database | SQLite via Drizzle ORM |
| Authentication | Clerk |
| Hosting | Vercel |

---

## How It Works

```
User pastes resume + job description
        ↓
AI analyzes ATS keyword match
        ↓
Score + gaps + rewrites returned in <10s
        ↓
User applies changes with one click
        ↓
Updated resume + cover letter ready to send
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## License

MIT © 2026