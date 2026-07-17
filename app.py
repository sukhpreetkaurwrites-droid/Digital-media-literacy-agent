"""
Satya Check — Digital Media Literacy & Fact-Checking Agent for India
Flask backend that sends user-submitted claims/articles/posts to Claude
and returns a structured credibility analysis.
"""

import os
import json
import re
import logging

from flask import Flask, request, jsonify, render_template
from anthropic import Anthropic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("satya-check")

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Anthropic client setup
# ---------------------------------------------------------------------------
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
MODEL_NAME = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5")

client = Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

MAX_INPUT_CHARS = 6000

SYSTEM_PROMPT = """You are Satya Check, an expert AI agent specializing in digital media
literacy and fact-checking for an Indian audience. Your mission has two parts:

1. Analyze a user-submitted news article, social media post, headline, image caption,
   or claim, and produce a careful, evidence-minded credibility assessment.
2. Teach the user, in plain language, how to recognize manipulation tactics themselves,
   so they get more resistant to misinformation over time — not just a verdict.

CONTEXT YOU MUST APPLY (India-specific):
- Be alert to common Indian misinformation patterns: WhatsApp-forward chain messages,
  morphed or out-of-context photos/videos, recycled old footage presented as breaking
  news, fake quotes attributed to politicians or celebrities, fabricated government
  scheme or "free money" announcements, communal or religiously inflammatory framing,
  fake job/lottery/KYC scam messages, health misinformation (home remedies, fake cures),
  satire mistaken for real news, and doctored screenshots of news channels or tweets.
- You do not have live internet access. You cannot verify a claim against today's news
  in real time. Be explicit about this limitation. Your job is to assess the *pattern*,
  *structure*, *language*, and *internal consistency* of the content, flag known hoax
  patterns you recognize, and give the user a clear plan to verify it themselves.
- Recommend well-established Indian and international fact-checking resources where
  relevant, such as PIB Fact Check, Alt News, BOOM Live, Factly, Vishvas News, India
  Today Fact Check, The Quint's WebQoof, Reuters Fact Check, and AFP Fact Check.
- Never state a claim is definitively true or false unless it is self-evidently a
  logical/internal contradiction, an obviously known satire outlet, or something your
  training data makes near-certain. Otherwise use calibrated language ("likely",
  "unverified", "consistent with known hoax patterns").

OUTPUT FORMAT:
Respond with ONLY a single valid JSON object — no markdown fences, no preamble, no
commentary before or after. Use exactly this schema:

{
  "verdict": one of ["Likely Credible", "Needs Verification", "Likely Misleading", "Likely False", "Satire", "Insufficient Information"],
  "credibility_score": integer 0-100 (0 = highly likely fabricated/manipulative, 100 = highly likely credible),
  "confidence": one of ["Low", "Medium", "High"],
  "summary": "2-3 sentence plain-language summary of your assessment",
  "red_flags": [ "short specific red flag found in THIS content", ... up to 6, empty list if none ],
  "manipulation_tactics": [
     {
       "tactic": "name of the tactic, e.g. 'Emotional/Outrage Framing', 'False Attribution', 'Out-of-Context Image', 'Fake Authority Citation', 'Urgency/Scarcity Pressure', 'Cherry-Picked Statistics'",
       "explanation": "1-2 sentences on how this tactic works in general AND, if present, how it shows up in this specific content",
       "present_in_content": true or false
     }
     ... 3 to 6 items, mix of tactics present and general educational ones relevant to this content
  ],
  "how_to_verify": [ "concrete, specific next step the user can personally take to verify this", ... 3 to 5 items ],
  "trusted_sources_to_check": [ "specific relevant fact-check org or primary source, e.g. 'PIB Fact Check (factcheck.pib.gov.in)'", ... 2 to 5 items ],
  "media_literacy_tip": "one memorable, generalizable lesson the user can carry forward to spot similar content in future"
}

Be specific to the actual submitted content — never generic filler. If the input is too
short or vague to assess, say so honestly in "summary" and use verdict "Insufficient Information".
"""


def extract_json(raw_text: str) -> dict:
    """Best-effort extraction of a JSON object from the model's response."""
    raw_text = raw_text.strip()
    # Strip markdown code fences if present
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        pass
    # Fallback: grab the first {...} block
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    raise ValueError("Could not parse a JSON object from the model response.")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/healthz")
def healthz():
    return jsonify({"status": "ok", "model": MODEL_NAME, "configured": bool(client)})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    if client is None:
        return jsonify({
            "error": "Server is missing ANTHROPIC_API_KEY. Set it in your Render "
                     "environment variables and redeploy."
        }), 500

    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()

    if not text:
        return jsonify({"error": "Please paste some text, a headline, or a claim to analyze."}), 400

    if len(text) > MAX_INPUT_CHARS:
        text = text[:MAX_INPUT_CHARS]

    try:
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1800,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": f"Analyze the following content:\n\n{text}"}
            ],
        )
        raw_text = "".join(
            block.text for block in response.content if getattr(block, "type", None) == "text"
        )
        result = extract_json(raw_text)
        return jsonify(result)

    except ValueError as e:
        logger.exception("Failed to parse model output")
        return jsonify({"error": f"Could not parse the analysis. Please try again. ({e})"}), 502
    except Exception as e:
        logger.exception("Error calling Anthropic API")
        return jsonify({"error": f"Something went wrong while analyzing: {e}"}), 502


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
