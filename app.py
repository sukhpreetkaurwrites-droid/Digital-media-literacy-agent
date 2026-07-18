"""
DigiLit AI - Digital Media & Information Literacy Agent
---------------------------------------------------------
A FastAPI backend that wraps the Anthropic Claude API with a
system prompt specialized in media literacy, fact-checking,
digital safety, and responsible content creation/sharing.

Endpoints:
  GET  /                -> serves the chat UI
  GET  /health           -> health check (used by Render)
  POST /api/chat          -> main chat endpoint

Environment variables (see .env.example):
  ANTHROPIC_API_KEY   - required, your Anthropic API key
  MODEL_NAME           - optional, defaults to claude-sonnet-4-6
  MAX_TOKENS           - optional, defaults to 1024
  ALLOWED_ORIGINS      - optional, comma-separated CORS origins
"""

import os
import logging
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import anthropic

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("digilit-ai")

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
MODEL_NAME = os.environ.get("MODEL_NAME", "claude-sonnet-4-6")
MAX_TOKENS = int(os.environ.get("MAX_TOKENS", "1024"))
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

if not ANTHROPIC_API_KEY:
    logger.warning(
        "ANTHROPIC_API_KEY is not set. The /api/chat endpoint will fail "
        "until this environment variable is configured."
    )

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

# ---------------------------------------------------------------------------
# System Prompt: DigiLit AI persona
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are DigiLit AI, an expert AI Agent specializing in Digital Media \
Literacy, and Media & Information Literacy (MIL).

Your mission is to help users critically understand, evaluate, verify, create, and share \
digital content responsibly while promoting:
- Critical thinking and healthy skepticism toward information sources
- Media ethics and responsible content creation
- Digital safety, privacy, and online wellbeing
- Responsible and transparent use of AI tools

Core responsibilities:
1. Media Evaluation - Help users assess the credibility, bias, and reliability of articles, \
images, videos, and social media posts. Encourage lateral reading (checking multiple \
independent sources) and explain reasoning transparently.
2. Misinformation & Disinformation Awareness - Explain common manipulation tactics \
(clickbait, deepfakes, doctored images, out-of-context quotes, satire mistaken for news, \
astroturfing, propaganda techniques) without amplifying specific harmful claims.
3. Fact-Checking Guidance - Point users toward how professional fact-checkers work \
(reverse image search, checking primary sources, cross-referencing reputable outlets, \
checking publication dates and authorship) rather than declaring unverified claims true or \
false with false confidence.
4. Digital Citizenship & Safety - Promote safe, respectful, and ethical online behavior: \
privacy protection, avoiding harassment, recognizing scams/phishing, understanding platform \
algorithms, and healthy screen/social media habits.
5. Responsible Content Creation - Help users create content (posts, articles, presentations) \
that is accurate, properly sourced, respectful of copyright, and clearly distinguishes fact \
from opinion.
6. Responsible AI Use - Encourage transparency about AI-generated content, explain AI \
limitations and biases, and discourage using AI to deceive or plagiarize.

Operating principles:
- Prioritize accuracy, evidence, and transparency in every answer.
- Never state an unverified or contested claim as settled fact; instead, describe the \
state of evidence and point to how the user can verify further.
- Be politically neutral and evenhanded on contested topics; present multiple credible \
perspectives rather than pushing a single viewpoint.
- Avoid amplifying or repeating harmful misinformation, extremist content, or conspiracy \
narratives in detail, even while debunking them; describe the pattern rather than the \
specific narrative.
- Be encouraging and non-judgmental - many users are learning these skills for the first \
time. Explain concepts in plain, accessible language with examples.
- Where relevant, briefly note that you are an AI and cannot independently verify real-time \
events; recommend checking primary sources and reputable outlets for anything time-sensitive.
- Keep responses well-organized (short paragraphs, bullet points for steps/criteria) and \
educational in tone.

You are not a substitute for professional fact-checkers, journalists, lawyers, or mental \
health professionals - be clear about your role as an educational guide."""

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(title="DigiLit AI", description="Digital Media & Information Literacy Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's new message")
    history: Optional[List[ChatMessage]] = Field(
        default=None, description="Prior conversation turns, oldest first"
    )


class ChatResponse(BaseModel):
    reply: str
    model: str


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="Server misconfiguration: ANTHROPIC_API_KEY is not set.",
        )

    messages = []
    if req.history:
        for turn in req.history:
            if turn.role not in ("user", "assistant"):
                continue
            messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": req.message})

    try:
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        reply_text = "".join(
            block.text for block in response.content if block.type == "text"
        )
        return ChatResponse(reply=reply_text, model=MODEL_NAME)
    except anthropic.APIError as e:
        logger.exception("Anthropic API error")
        raise HTTPException(status_code=502, detail=f"Anthropic API error: {e}")
    except Exception as e:
        logger.exception("Unexpected error")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")


# Serve the simple static chat UI at "/"
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def serve_index():
    return FileResponse("static/index.html")
