# DigiLit AI

An AI agent specializing in **Digital Media Literacy** and **Media & Information Literacy (MIL)**.
DigiLit AI helps users critically understand, evaluate, verify, create, and share digital
content responsibly — promoting critical thinking, media ethics, digital safety, and
responsible AI use.

Built with **FastAPI** + the **Anthropic Claude API**, deployable to **Render** in a few minutes.

---

## Project structure

```
digilit-ai/
├── app.py                # FastAPI app + DigiLit AI system prompt + /api/chat endpoint
├── static/
│   └── index.html         # Simple built-in chat UI
├── requirements.txt        # Python dependencies
├── render.yaml            # Render Blueprint (Infrastructure as Code)
├── .env.example            # Template for local environment variables
├── .gitignore
└── README.md
```

---

## 1. Run locally

```bash
git clone https://github.com/<your-username>/digilit-ai.git
cd digilit-ai

python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# then edit .env and add your ANTHROPIC_API_KEY

export $(grep -v '^#' .env | xargs)   # loads env vars into shell (macOS/Linux)
uvicorn app:app --reload --port 8000
```

Open **http://localhost:8000** in your browser to chat with DigiLit AI.

---

## 2. Push the project to GitHub

From inside the `digilit-ai` folder:

```bash
git init
git add .
git commit -m "Initial commit: DigiLit AI agent"

# Create the repo on GitHub first (via github.com or gh CLI), then:
git branch -M main
git remote add origin https://github.com/<your-username>/digilit-ai.git
git push -u origin main
```

Optional — using the GitHub CLI to create the repo in one step:

```bash
gh repo create digilit-ai --public --source=. --remote=origin --push
```

> **Important:** Never commit your real `.env` file or API key. `.gitignore` already
> excludes `.env` for you.

---

## 3. Deploy to Render

### Option A — One-click Blueprint deploy (recommended)

The repo includes a `render.yaml` Blueprint, so Render can configure everything automatically.

1. Push the repo to GitHub (see step 2).
2. Go to https://dashboard.render.com/blueprints
3. Click **New Blueprint Instance** → connect your GitHub account → select the `digilit-ai` repo.
4. Render reads `render.yaml` and creates the web service automatically.
5. When prompted, set the **ANTHROPIC_API_KEY** environment variable (marked `sync: false` so
   Render asks you to enter it securely — it's never stored in the repo).
6. Click **Apply** / **Create Web Service**. Render will build and deploy automatically.

### Option B — Manual web service (no Blueprint)

1. Go to https://dashboard.render.com → **New** → **Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key
   - `MODEL_NAME` = `claude-sonnet-4-6` (optional, this is the default)
   - `MAX_TOKENS` = `1024` (optional)
   - `ALLOWED_ORIGINS` = `*` (or your frontend domain)
5. Click **Create Web Service**. Render will build and deploy automatically on every push to `main`.

### Option C — Render CLI

```bash
# Install Render CLI (macOS example)
brew install render

# Log in
render login

# Deploy using the render.yaml blueprint in the current repo
render blueprint launch
```

---

## 4. Verify the deployment

```bash
curl https://<your-service>.onrender.com/health

curl -X POST https://<your-service>.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I fact-check a viral social media post?"}'
```

---

## Customizing the agent

The full DigiLit AI persona and behavior rules live in the `SYSTEM_PROMPT` string inside
`app.py`. Edit that string to adjust tone, scope, or add new focus areas (e.g., specific
curricula, age groups, or platform guidelines), then redeploy.

## Notes on responsible use

DigiLit AI is designed to:
- Encourage lateral reading and multi-source verification rather than asserting unverified claims as fact.
- Explain manipulation tactics (deepfakes, clickbait, doctored media) at a pattern level without amplifying specific harmful narratives.
- Stay politically neutral on contested topics and present multiple credible perspectives.
- Clearly position itself as an educational guide, not a substitute for professional fact-checkers, journalists, or legal/mental health professionals.
