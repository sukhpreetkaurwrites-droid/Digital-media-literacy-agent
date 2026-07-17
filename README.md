# Satya Check — Digital Media Literacy & Fact-Checking Agent (India)

An AI agent that analyzes user-submitted news articles, headlines, social media
posts, or claims, assesses their credibility, and — more importantly — teaches
the user how to recognize manipulation tactics themselves. Built with an
India-specific lens: WhatsApp-forward hoaxes, communal misinformation framing,
fake government-scheme claims, morphed images, fake quotes, and more.

**Stack:** Flask (Python) backend + vanilla HTML/CSS/JS frontend, powered by
the Anthropic API (Claude). Ships ready to deploy on [Render](https://render.com)
as a single web service.

---

## 1. Project structure

```
fact-checker-agent/
├── app.py                 # Flask app + /api/analyze endpoint
├── requirements.txt       # Python dependencies
├── render.yaml            # Render Blueprint (one-click deploy config)
├── .env.example            # Template for local environment variables
├── .gitignore
├── templates/
│   └── index.html          # UI markup
└── static/
    ├── style.css           # Visual design
    └── script.js           # Frontend logic (calls /api/analyze)
```

---

## 2. Get an Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign in / sign up.
2. Create an API key under **Settings → API Keys**.
3. Keep it handy — you'll paste it into Render as an environment variable
   (never commit it to GitHub).

---

## 3. Push this project to GitHub

From inside the unzipped `fact-checker-agent` folder:

```bash
git init
git add .
git commit -m "Initial commit: Satya Check fact-checking agent"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

(Create the empty repo on GitHub first via **New repository** — don't
initialize it with a README so there's no merge conflict.)

---

## 4. Deploy on Render

### Option A — Blueprint (recommended, uses `render.yaml`)

1. Log in to [render.com](https://render.com) and click **New → Blueprint**.
2. Connect your GitHub account and select the repo you just pushed.
3. Render will detect `render.yaml` and pre-fill a **Web Service** named
   `satya-check-fact-agent`.
4. When prompted for environment variables, set:
   - `ANTHROPIC_API_KEY` → paste your key from step 2
   - `CLAUDE_MODEL` → leave as `claude-sonnet-5` (or change to another Claude model string)
5. Click **Apply** / **Create Web Service**. Render will install
   `requirements.txt` and start the app with `gunicorn`.

### Option B — Manual Web Service

1. **New → Web Service** → connect the repo.
2. Settings:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
3. Under **Environment → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key
   - `CLAUDE_MODEL` = `claude-sonnet-5`
4. Click **Create Web Service**.

Render will give you a live URL like `https://satya-check-fact-agent.onrender.com`
— open it and the UI will be live and working.

> Free-tier Render services spin down after inactivity, so the first request
> after idling can take ~30–60 seconds to wake up. This is normal.

---

## 5. Run locally (optional, for testing before you deploy)

```bash
cd fact-checker-agent
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit .env and add your real API key
export $(cat .env | xargs)      # or use python-dotenv / your shell's env loading

python app.py
```

Visit `http://localhost:5000`.

---

## 6. How it works

- The frontend (`templates/index.html`, `static/script.js`) collects the
  pasted content and POSTs it to `/api/analyze`.
- `app.py` sends the content to Claude with a detailed system prompt
  (`SYSTEM_PROMPT` in `app.py`) instructing it to act as an India-focused
  fact-checking and media-literacy expert, and to return **strict JSON**:
  verdict, credibility score, red flags, manipulation tactics found, concrete
  verification steps, trusted fact-checking sources (PIB Fact Check, Alt News,
  BOOM Live, Factly, Vishvas News, The Quint's WebQoof, Reuters/AFP Fact Check),
  and one memorable media-literacy takeaway.
- The frontend renders this into a "case file" style report: a verdict stamp,
  a credibility gauge, red-flag list, tactic cards, a verification checklist,
  and source chips.

### Customizing the agent
- Edit `SYSTEM_PROMPT` in `app.py` to change tone, add more India-specific
  hoax patterns, add regional-language handling instructions, or change the
  JSON schema (update `static/script.js`'s `renderResults` to match if you do).
- Change `CLAUDE_MODEL` in Render's environment variables to try a different
  Claude model without touching code.

---

## 7. Important limitations to communicate to users

- The agent has **no live internet/search access** in this build — it
  evaluates structure, language, and known manipulation patterns, not
  real-time news facts. This is stated in the UI footer and in the system
  prompt so the agent itself is calibrated and honest about uncertainty.
- It is a literacy and triage tool, not a legal or definitive verdict —
  always encourage users to check the linked fact-checking organizations
  before sharing or acting on a claim.
