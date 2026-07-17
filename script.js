/* ---------------------------------------------------------------------
   Satya Check — design tokens
   Concept: an investigative "case file" desk. Deep ink-navy ground,
   marigold/turmeric accent (nods to Indian everyday visual culture
   without leaning on flag colors), stamp-red / verified-green verdicts.
   Fraunces for editorial display type, Inter for body, IBM Plex Mono
   for "evidence" data (scores, dates, source names).
------------------------------------------------------------------------ */

:root {
  --ink-900: #12141d;
  --ink-800: #1b1f2e;
  --ink-700: #262c40;
  --ink-600: #3a4160;
  --ink-400: #8890a8;
  --paper: #efeadf;
  --paper-dim: #d9d3c2;
  --turmeric: #e2a23b;
  --turmeric-dim: #b57e2c;
  --stamp-red: #c1443d;
  --verified-green: #4a9463;
  --needs-blue: #4c7ea8;

  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "IBM Plex Mono", "Courier New", monospace;

  --radius-card: 6px;
  --max-width: 780px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--ink-900);
  color: var(--paper);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  position: relative;
  background-image:
    radial-gradient(circle at 12% 8%, rgba(226,162,59,0.07), transparent 40%),
    radial-gradient(circle at 90% 85%, rgba(76,126,168,0.08), transparent 45%);
}

.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---------------- Masthead ---------------- */

.masthead {
  position: relative;
  z-index: 2;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 24px 0;
}

.masthead-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mark {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  color: var(--turmeric);
}
.mark-svg { width: 100%; height: 100%; }

.masthead-text { flex: 1; }

.masthead h1 {
  font-family: var(--font-display);
  font-optical-sizing: auto;
  font-weight: 600;
  font-size: 2.1rem;
  margin: 0;
  letter-spacing: -0.01em;
  color: var(--paper);
}

.tagline {
  margin: 2px 0 0;
  font-size: 0.82rem;
  color: var(--ink-400);
  font-family: var(--font-mono);
  letter-spacing: 0.01em;
}

.masthead-date {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-400);
  align-self: flex-start;
  padding-top: 6px;
  white-space: nowrap;
}

.masthead-rule {
  margin-top: 22px;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    var(--turmeric), var(--turmeric) 10px,
    transparent 10px, transparent 14px
  );
  opacity: 0.6;
}

/* ---------------- Dossier / main ---------------- */

.dossier {
  position: relative;
  z-index: 2;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 36px 24px 20px;
}

.intake {
  background: var(--ink-800);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius-card);
  padding: 28px 28px 22px;
}

.exhibit-label { margin-bottom: 6px; }

.exhibit-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-900);
  background: var(--turmeric);
  padding: 3px 9px;
  border-radius: 3px;
  margin-bottom: 10px;
}

.intake h2 {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.4rem;
  margin: 4px 0 0;
  color: var(--paper);
}

.intake-hint {
  color: var(--ink-400);
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 10px 0 20px;
  max-width: 62ch;
}

textarea#content-input {
  width: 100%;
  background: var(--ink-900);
  border: 1px solid var(--ink-600);
  border-radius: 4px;
  color: var(--paper);
  font-family: var(--font-body);
  font-size: 0.96rem;
  line-height: 1.55;
  padding: 14px 16px;
  resize: vertical;
  min-height: 140px;
}
textarea#content-input:focus {
  outline: 2px solid var(--turmeric);
  outline-offset: 1px;
  border-color: var(--turmeric);
}
textarea#content-input::placeholder { color: var(--ink-400); }

.intake-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.char-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-400);
}

/* ---------------- Stamp button ---------------- */

.stamp-button {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-900);
  background: var(--turmeric);
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.12s ease, background 0.15s ease;
}
.stamp-button:hover { background: #efb15a; transform: translateY(-1px); }
.stamp-button:active { transform: translateY(0); }
.stamp-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.secondary-button {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  background: transparent;
  color: var(--turmeric);
  border: 1px solid var(--turmeric-dim);
  border-radius: 4px;
  padding: 10px 16px;
  cursor: pointer;
  margin-top: 8px;
}
.secondary-button:hover { background: rgba(226,162,59,0.08); }

/* ---------------- Loading ---------------- */

.loading-box { margin-top: 22px; text-align: center; padding: 30px 10px; }
.loading-stamp p {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--ink-400);
  margin-top: 12px;
}
.spinner {
  width: 30px; height: 30px;
  border: 3px solid var(--ink-700);
  border-top-color: var(--turmeric);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ---------------- Error ---------------- */

.error-box {
  margin-top: 18px;
  background: rgba(193,68,61,0.12);
  border: 1px solid var(--stamp-red);
  color: #f3c9c6;
  padding: 14px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* ---------------- Results ---------------- */

.results {
  margin-top: 30px;
  animation: fadein 0.4s ease;
}
@keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

.verdict-row {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.verdict-stamp {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-align: center;
  color: var(--stamp-red);
  border: 3px solid var(--stamp-red);
  border-radius: 8px;
  padding: 12px 18px;
  transform: rotate(-6deg);
  white-space: nowrap;
  box-shadow: 0 0 0 3px rgba(193,68,61,0.15) inset;
  animation: stamp-in 0.35s cubic-bezier(.2,1.4,.4,1);
  flex-shrink: 0;
}
.verdict-stamp.green { color: var(--verified-green); border-color: var(--verified-green); box-shadow: 0 0 0 3px rgba(74,148,99,0.15) inset; }
.verdict-stamp.blue  { color: var(--needs-blue); border-color: var(--needs-blue); box-shadow: 0 0 0 3px rgba(76,126,168,0.15) inset; }
.verdict-stamp.amber { color: var(--turmeric); border-color: var(--turmeric); box-shadow: 0 0 0 3px rgba(226,162,59,0.15) inset; }

@keyframes stamp-in {
  from { opacity: 0; transform: rotate(-6deg) scale(1.6); }
  to   { opacity: 1; transform: rotate(-6deg) scale(1); }
}

.gauge-wrap { flex: 1; min-width: 220px; }

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--ink-400);
  margin-bottom: 5px;
}

.gauge-track {
  position: relative;
  height: 10px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--stamp-red), var(--turmeric) 50%, var(--verified-green));
  opacity: 0.9;
}

.gauge-needle {
  position: absolute;
  top: -5px;
  width: 3px;
  height: 20px;
  background: var(--paper);
  left: 0%;
  transform: translateX(-50%);
  border-radius: 2px;
  transition: left 0.7s cubic-bezier(.2,.9,.3,1);
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
}

.gauge-fill { display: none; }

.gauge-score {
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--paper);
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.gauge-score-max { font-size: 0.85rem; color: var(--ink-400); }

.confidence-chip {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid var(--ink-600);
  color: var(--ink-400);
  border-radius: 10px;
  padding: 2px 9px;
  margin-left: auto;
}

.summary-text {
  font-family: var(--font-display);
  font-size: 1.15rem;
  line-height: 1.55;
  color: var(--paper);
  border-left: 3px solid var(--turmeric);
  padding-left: 16px;
  margin: 22px 0 30px;
}

/* ---------------- Case sections ---------------- */

.case-section { margin-bottom: 30px; }

.case-section h3 {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--paper);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ink-700);
}

.case-number {
  font-family: var(--font-mono);
  color: var(--turmeric);
  font-size: 0.85rem;
}

.flag-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.flag-list li {
  background: rgba(193,68,61,0.08);
  border-left: 3px solid var(--stamp-red);
  padding: 10px 14px;
  border-radius: 3px;
  font-size: 0.92rem;
  line-height: 1.5;
}

.empty-note {
  color: var(--ink-400);
  font-size: 0.88rem;
  font-style: italic;
}

.tactics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.tactic-card {
  background: var(--ink-800);
  border: 1px solid var(--ink-700);
  border-radius: 4px;
  padding: 14px 16px;
  position: relative;
}
.tactic-card.present { border-color: var(--turmeric-dim); }

.tactic-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tactic-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--paper);
}

.tactic-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--ink-600);
  flex-shrink: 0;
}
.tactic-card.present .tactic-dot { background: var(--turmeric); }

.tactic-explain {
  font-size: 0.85rem;
  color: var(--ink-400);
  line-height: 1.5;
  margin: 0;
}

.tactic-present-flag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--turmeric);
}

.verify-list {
  margin: 0;
  padding-left: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.verify-list li {
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--paper);
}
.verify-list li::marker {
  font-family: var(--font-mono);
  color: var(--turmeric);
  font-weight: 600;
}

.sources-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.source-chip {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--ink-800);
  border: 1px solid var(--ink-600);
  color: var(--paper);
  padding: 6px 12px;
  border-radius: 14px;
}

.tip-pullquote {
  background: linear-gradient(135deg, rgba(226,162,59,0.1), rgba(226,162,59,0.02));
  border: 1px solid var(--turmeric-dim);
  border-radius: 6px;
  padding: 20px 22px;
  margin-bottom: 22px;
}
.tip-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--turmeric);
  margin-bottom: 8px;
}
.tip-pullquote p {
  font-family: var(--font-display);
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
  color: var(--paper);
}

/* ---------------- Footer ---------------- */

.site-footer {
  position: relative;
  z-index: 2;
  max-width: var(--max-width);
  margin: 20px auto 60px;
  padding: 18px 24px 0;
  border-top: 1px solid var(--ink-700);
}
.site-footer p {
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--ink-400);
  max-width: 68ch;
}

/* ---------------- Responsive ---------------- */

@media (max-width: 560px) {
  .masthead h1 { font-size: 1.6rem; }
  .masthead-date { display: none; }
  .intake { padding: 20px 16px; }
  .verdict-row { flex-direction: column; align-items: flex-start; }
  .verdict-stamp { transform: rotate(-3deg); }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .results, .verdict-stamp, .spinner, .gauge-needle { animation: none !important; transition: none !important; }
}

/* Focus visibility */
a:focus-visible, button:focus-visible, textarea:focus-visible {
  outline: 2px solid var(--turmeric);
  outline-offset: 2px;
}
