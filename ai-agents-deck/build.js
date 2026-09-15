const pptxgen = require("pptxgenjs");

const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.author = "ZCode";
p.title = "The Evolution of AI Agents";

// Palette — dark tech: near-black surface, teal primary, amber accent
const BG = "0D1117", CARD = "161B22", CARD2 = "1C2330";
const PRIMARY = "2DD4BF", PRIMARY_DK = "0F766E";
const ACCENT = "F59E0B";
const TEXT = "E6EDF3", MUTED = "9BA7B4";
const F = "Segoe UI";
const W = 13.33, H = 7.5, M = 0.55;

const shadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 90, opacity: 0.35 });

function base(s) { s.background = { color: BG }; }

// header used on content slides
function header(s, kicker, title) {
  s.addText(kicker, { x: M, y: 0.42, w: 9, h: 0.35, fontFace: F, fontSize: 13, color: PRIMARY, charSpacing: 3, bold: true, margin: 0 });
  s.addText(title, { x: M, y: 0.72, w: 11.5, h: 0.75, fontFace: F, fontSize: 34, color: TEXT, bold: true, margin: 0 });
}

// signature motif: node + line
function timelineTrack(s, y, segments, activeIdx) {
  const x0 = M, x1 = W - M, trackW = x1 - x0;
  s.addShape(p.shapes.LINE, { x: x0, y: y, w: trackW, h: 0, line: { color: CARD2, width: 3 } });
  const segW = trackW / segments.length;
  segments.forEach((seg, i) => {
    const cx = x0 + segW * i + segW / 2;
    const col = i === activeIdx ? ACCENT : PRIMARY;
    s.addShape(p.shapes.OVAL, { x: cx - 0.09, y: y - 0.09, w: 0.18, h: 0.18, fill: { color: col }, line: { color: BG, width: 2 } });
    s.addText(seg, { x: cx - segW / 2, y: y + 0.16, w: segW, h: 0.3, align: "center", fontFace: F, fontSize: 12, color: i === activeIdx ? ACCENT : MUTED, margin: 0 });
  });
}

/* ---------------- 1 · Cover ---------------- */
let s = p.addSlide(); base(s);
// faint node-grid motif: connecting lines + nodes, right side
const nodes = [[9.2, 1.4], [11.6, 2.3], [10.3, 4.2], [12.5, 5.4], [9.8, 5.9], [11.9, 0.9]];
const edges = [[0, 1], [1, 2], [2, 3], [2, 4], [0, 5]];
edges.forEach(([a, b]) => {
  const [xa, ya] = nodes[a], [xb, yb] = nodes[b];
  s.addShape(p.shapes.LINE, { x: Math.min(xa, xb), y: Math.min(ya, yb), w: Math.abs(xb - xa), h: Math.abs(yb - ya), flipV: (xb - xa) * (yb - ya) < 0, line: { color: PRIMARY_DK, width: 1 } });
});
nodes.forEach(([x, y], i) => s.addShape(p.shapes.OVAL, { x: x - 0.05, y: y - 0.05, w: 0.1, h: 0.1, fill: { color: i % 2 ? PRIMARY : ACCENT } }));

s.addText("2020 — 2026", { x: M, y: 1.5, w: 5, h: 0.4, fontFace: F, fontSize: 15, color: ACCENT, bold: true, charSpacing: 4, margin: 0 });
s.addText("The Evolution of AI Agents", { x: M, y: 2.0, w: 8.6, h: 2.2, fontFace: F, fontSize: 60, color: TEXT, bold: true, margin: 0 });
s.addText("From crafting the perfect prompt, to engineering the right context, to building the harness that lets agents act.", { x: M, y: 4.35, w: 7.6, h: 0.9, fontFace: F, fontSize: 18, color: MUTED, margin: 0 });
// three stage chips
const stages = ["01  Prompt Engineering", "02  Context Engineering", "03  Harness Engineering"];
stages.forEach((t, i) => {
  const x = M + i * 3.35;
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: 5.7, w: 3.05, h: 0.62, rectRadius: 0.08, fill: { color: CARD }, line: { color: i === 2 ? ACCENT : CARD2, width: 1 } });
  s.addText(t, { x, y: 5.7, w: 3.05, h: 0.62, align: "center", valign: "middle", fontFace: F, fontSize: 14, color: i === 2 ? ACCENT : TEXT, bold: true, margin: 0 });
  if (i < 2) s.addText("→", { x: x + 3.05, y: 5.7, w: 0.3, h: 0.62, align: "center", valign: "middle", fontFace: F, fontSize: 16, color: MUTED, margin: 0 });
});

/* ---------------- 2 · Timeline overview ---------------- */
s = p.addSlide(); base(s);
header(s, "OVERVIEW", "Three eras of agent engineering");
const tl = [
  { era: "Prompt Engineering", yrs: "2020 – 2023", color: PRIMARY, items: ["GPT-3 few-shot demos", "Chain-of-Thought (2022)", "ReAct: reason + act (2022)"], desc: "The model is fixed; you steer it with words." },
  { era: "Context Engineering", yrs: "2023 – 2025", color: PRIMARY, items: ["RAG goes mainstream", "Function calling & tools", "Memory & MCP (2024–25)"], desc: "The model is fixed; you feed it the right information." },
  { era: "Harness Engineering", yrs: "2025 →", color: ACCENT, items: ["AutoGPT-era autonomy", "Agent frameworks mature", "OpenClaw, ACP-based agents"], desc: "You build the loop the agent runs in." },
];
const colW = (W - 2 * M - 0.6) / 3;
tl.forEach((t, i) => {
  const x = M + i * (colW + 0.3);
  // era card
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: 2.35, w: colW, h: 4.3, rectRadius: 0.1, fill: { color: CARD }, shadow: shadow() });
  s.addText(t.yrs, { x: x + 0.3, y: 2.65, w: colW - 0.6, h: 0.35, fontFace: F, fontSize: 13, color: t.color, bold: true, charSpacing: 2, margin: 0 });
  s.addText(t.era, { x: x + 0.3, y: 3.0, w: colW - 0.6, h: 0.55, fontFace: F, fontSize: 22, color: TEXT, bold: true, margin: 0 });
  const bu = () => ({ code: "25B8", indent: 10 });
  s.addText(t.items.map((it, j) => ({ text: it, options: { bullet: bu(), breakLine: j < t.items.length - 1, color: MUTED } })),
    { x: x + 0.3, y: 3.65, w: colW - 0.6, h: 1.5, fontFace: F, fontSize: 14, paraSpaceAfter: 8, margin: 0 });
  s.addText(t.desc, { x: x + 0.3, y: 5.55, w: colW - 0.6, h: 0.9, fontFace: F, fontSize: 14, italic: true, color: t.color, margin: 0 });
});
timelineTrack(s, 1.85, ["Prompt Engineering  2020–2023", "Context Engineering  2023–2025", "Harness Engineering  2025 →"], 2);

/* ---------------- 3 · Prompt Engineering: origins + techniques ---------------- */
s = p.addSlide(); base(s);
header(s, "STAGE 01 · PROMPT ENGINEERING", "Talk to the model until it behaves");
// left: origins
s.addText("Origins", { x: M, y: 1.9, w: 3.6, h: 0.4, fontFace: F, fontSize: 17, color: PRIMARY, bold: true, margin: 0 });
s.addText([
  { text: "2020 — GPT-3 shows prompt design beats fine-tuning for many tasks", options: { bullet: { code: "2013", indent: 12 }, breakLine: true } },
  { text: "2021 — prompt patterns spread via APIs and community playbooks", options: { bullet: { code: "2013", indent: 12 }, breakLine: true } },
  { text: "2022 — research formalizes it: CoT, self-consistency, instruction tuning", options: { bullet: { code: "2013", indent: 12 } } },
], { x: M, y: 2.35, w: 3.6, h: 2.2, fontFace: F, fontSize: 14, color: MUTED, paraSpaceAfter: 10, margin: 0 });
s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.15, w: 3.6, h: 1.5, rectRadius: 0.1, fill: { color: CARD2 } });
s.addText([{ text: "\u201CThis is a conversation with a model.\u201D", options: { italic: true, breakLine: true } },
{ text: "The entire interface is one text box.", options: { color: MUTED, fontSize: 13 } }],
  { x: M + 0.25, y: 5.15, w: 3.1, h: 1.5, fontFace: F, fontSize: 15, color: TEXT, valign: "middle", margin: 0 });
// right: technique stack diagram
s.addText("Core techniques — a layered stack", { x: 4.7, y: 1.9, w: 8, h: 0.4, fontFace: F, fontSize: 17, color: PRIMARY, bold: true, margin: 0 });
const techs = [
  ["Role & instruction prompts", "Set persona, constraints, output format"],
  ["Zero-shot / few-shot", "Show examples instead of training"],
  ["Chain-of-Thought", "\u201CThink step by step\u201D — decompose reasoning"],
  ["Self-consistency & structured output", "Sample many paths, force JSON/schema"],
];
techs.forEach((t, i) => {
  const y = 2.4 + i * 1.12;
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: 4.7, y, w: 8.05, h: 0.95, rectRadius: 0.07, fill: { color: i === 2 ? CARD2 : CARD }, line: i === 2 ? { color: ACCENT, width: 1 } : { color: CARD2, width: 1 } });
  s.addText(String(i + 1).padStart(2, "0"), { x: 4.95, y: y + 0.08, w: 0.7, h: 0.8, fontFace: F, fontSize: 26, bold: true, color: i === 2 ? ACCENT : PRIMARY, margin: 0 });
  s.addText(t[0], { x: 5.75, y: y + 0.1, w: 6.8, h: 0.4, fontFace: F, fontSize: 16, bold: true, color: TEXT, margin: 0 });
  s.addText(t[1], { x: 5.75, y: y + 0.5, w: 6.8, h: 0.35, fontFace: F, fontSize: 13, color: MUTED, margin: 0 });
});
timelineTrack(s, 1.62, ["Prompt Engineering", "Context Engineering", "Harness Engineering"], 0);

/* ---------------- 4 · Prompt Engineering: limitations ---------------- */
s = p.addSlide(); base(s);
header(s, "STAGE 01 · PROMPT ENGINEERING", "Where words run out");
const lims = [
  ["Fragile", "A phrasing tweak shifts accuracy by double digits; prompts break silently when models update."],
  ["No memory", "Every conversation starts from zero — nothing is learned or carried forward."],
  ["No tools", "The model can reason about the world but cannot read a file, call an API, or act."],
  ["Context ceiling", "Everything must fit in one window: long documents and large codebases simply don't."],
];
const lw = (W - 2 * M - 0.9) / 2;
lims.forEach((l, i) => {
  const x = M + (i % 2) * (lw + 0.9), y = 2.25 + Math.floor(i / 2) * 1.95;
  s.addShape(p.shapes.OVAL, { x, y: y + 0.05, w: 0.55, h: 0.55, fill: { color: CARD2 }, line: { color: ACCENT, width: 1.25 } });
  s.addText("!", { x, y: y + 0.05, w: 0.55, h: 0.55, align: "center", valign: "middle", fontFace: F, fontSize: 20, bold: true, color: ACCENT, margin: 0 });
  s.addText(l[0], { x: x + 0.8, y, w: lw - 0.8, h: 0.4, fontFace: F, fontSize: 19, bold: true, color: TEXT, margin: 0 });
  s.addText(l[1], { x: x + 0.8, y: y + 0.42, w: lw - 0.8, h: 0.85, fontFace: F, fontSize: 14, color: MUTED, margin: 0 });
});
s.addShape(p.shapes.LINE, { x: M, y: 6.15, w: W - 2 * M, h: 0, line: { color: CARD2, width: 1 } });
s.addText([{ text: "The next move: ", options: { color: MUTED } }, { text: "stop optimizing the question — start engineering what the model sees.", options: { color: ACCENT, bold: true } }],
  { x: M, y: 6.35, w: W - 2 * M, h: 0.5, fontFace: F, fontSize: 17, margin: 0 });
timelineTrack(s, 1.62, ["Prompt Engineering", "Context Engineering", "Harness Engineering"], 0);

/* ---------------- 5 · Context Engineering: why ---------------- */
s = p.addSlide(); base(s);
header(s, "STAGE 02 · CONTEXT ENGINEERING", "The model is only as good as what it sees");
// focal: context window composition diagram
s.addText("What fills the context window", { x: M, y: 1.95, w: 7, h: 0.4, fontFace: F, fontSize: 17, color: PRIMARY, bold: true, margin: 0 });
const parts = [
  ["System", 1.0, PRIMARY_DK], ["RAG docs", 2.0, PRIMARY], ["Memory", 1.3, "14B8A6"], ["Tools & results", 1.7, ACCENT], ["User turn", 0.9, "64748B"],
];
let px = M;
parts.forEach(([label, w, c]) => {
  s.addShape(p.shapes.RECTANGLE, { x: px, y: 2.5, w, h: 1.05, fill: { color: c }, line: { color: BG, width: 1 } });
  s.addText(label, { x: px, y: 2.5, w, h: 1.05, align: "center", valign: "middle", fontFace: F, fontSize: 12.5, bold: true, color: label === "User turn" ? "0D1117" : BG, margin: 0 });
  px += w;
});
s.addText("prompt engineering tunes the first slice — context engineering designs the whole window", { x: M, y: 3.7, w: 7.2, h: 0.4, fontFace: F, fontSize: 13, italic: true, color: MUTED, margin: 0 });
// right: big stat
s.addText("128K → 1M+", { x: 8.3, y: 2.2, w: 4.4, h: 1.0, fontFace: F, fontSize: 48, bold: true, color: ACCENT, margin: 0 });
s.addText("tokens of context in frontier models (2023 → 2025). Bigger windows made managing what goes in — and what stays out — the core discipline.", { x: 8.3, y: 3.25, w: 4.4, h: 1.3, fontFace: F, fontSize: 14, color: MUTED, margin: 0 });
// bottom: three shifts
const shifts = [["From", "carefully worded instructions", "To", "dynamically assembled context"]];
s.addShape(p.shapes.LINE, { x: M, y: 5.15, w: W - 2 * M, h: 0, line: { color: CARD2, width: 1 } });
s.addText([
  { text: "The shift: ", options: { bold: true, color: TEXT } },
  { text: "the unit of design is no longer the prompt — it is everything the model can see at decision time, and the pipeline that assembles it.", options: { color: MUTED } },
], { x: M, y: 5.4, w: W - 2 * M, h: 0.9, fontFace: F, fontSize: 17, margin: 0 });
timelineTrack(s, 1.62, ["Prompt Engineering", "Context Engineering", "Harness Engineering"], 1);

/* ---------------- 6 · Context Engineering: key technologies ---------------- */
s = p.addSlide(); base(s);
header(s, "STAGE 02 · CONTEXT ENGINEERING", "Three technologies carry the era");
const tech3 = [
  ["RAG", "Retrieval-Augmented Generation", "Embed a knowledge base, retrieve the relevant chunks at query time, and ground answers in cited sources — the fix for stale, hallucinated knowledge."],
  ["Memory", "Short & long-term state", "Conversation summaries, vector recall of past interactions, and scratchpads let an agent persist learning across sessions instead of restarting from zero."],
  ["Tool Use", "Function calling & MCP", "Models invoke APIs, run code, and search the web. The Model Context Protocol (2024) standardizes how models discover and call external tools."],
];
const tw = (W - 2 * M - 0.8) / 3;
tech3.forEach((t, i) => {
  const x = M + i * (tw + 0.4);
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: tw, h: 4.35, rectRadius: 0.1, fill: { color: CARD }, shadow: shadow() });
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: 2.3, w: 1.7, h: 0.55, rectRadius: 0.08, fill: { color: CARD2 } });
  s.addText(t[0], { x: x + 0.3, y: 2.3, w: 1.7, h: 0.55, align: "center", valign: "middle", fontFace: F, fontSize: 16, bold: true, color: i === 2 ? ACCENT : PRIMARY, margin: 0 });
  s.addText(t[1], { x: x + 0.3, y: 3.05, w: tw - 0.6, h: 0.6, fontFace: F, fontSize: 17, bold: true, color: TEXT, margin: 0 });
  s.addText(t[2], { x: x + 0.3, y: 3.75, w: tw - 0.6, h: 2.4, fontFace: F, fontSize: 13.5, color: MUTED, margin: 0 });
});
s.addText("Together they turn a static chatbot into a system that knows things, remembers things, and does things.", { x: M, y: 6.65, w: W - 2 * M, h: 0.4, fontFace: F, fontSize: 15, italic: true, color: PRIMARY, margin: 0 });
timelineTrack(s, 1.62, ["Prompt Engineering", "Context Engineering", "Harness Engineering"], 1);

/* ---------------- 7 · Harness Engineering: framework evolution ---------------- */
s = p.addSlide(); base(s);
header(s, "STAGE 03 · HARNESS ENGINEERING", "Build the loop the agent runs in");
timelineTrack(s, 1.62, ["Prompt Engineering", "Context Engineering", "Harness Engineering"], 2);
s.addText("A harness is the scaffolding around the model: the planner, the tool registry, the memory store, the guardrails, and the controller that keeps the loop alive.", { x: M, y: 2.2, w: 12.2, h: 0.5, fontFace: F, fontSize: 14, color: MUTED, margin: 0 });
// horizontal flow: goal → plan → act → observe → loop
const flow = [["Goal", "user intent"], ["Plan", "decompose tasks"], ["Act", "call tools"], ["Observe", "read results"], ["Reflect & loop", "retry / refine"]];
const fw = 2.14, gap = 0.4, fy = 2.95;
flow.forEach((f, i) => {
  const x = M + i * (fw + gap);
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: fy, w: fw, h: 1.15, rectRadius: 0.09, fill: { color: i === 4 ? CARD2 : CARD }, line: i === 4 ? { color: ACCENT, width: 1 } : { color: CARD2, width: 1 } });
  s.addText(f[0], { x, y: fy + 0.12, w: fw, h: 0.45, align: "center", fontFace: F, fontSize: 16, bold: true, color: i === 4 ? ACCENT : TEXT, margin: 0 });
  s.addText(f[1], { x, y: fy + 0.58, w: fw, h: 0.4, align: "center", fontFace: F, fontSize: 12, color: MUTED, margin: 0 });
  if (i < 4) s.addText("→", { x: x + fw, y: fy, w: gap, h: 1.15, align: "center", valign: "middle", fontFace: F, fontSize: 18, color: PRIMARY, margin: 0 });
});
// loop-back arrow
s.addShape(p.shapes.LINE, { x: M + 4 * (fw + gap) + fw / 2, y: fy + 1.15, w: 0, h: 0.45, line: { color: ACCENT, width: 1.5 } });
s.addShape(p.shapes.LINE, { x: M + fw / 2, y: fy + 1.6, w: 4 * (fw + gap), h: 0, line: { color: ACCENT, width: 1.5, beginArrowType: "arrow" } });
s.addText("iteration until done", { x: M + 2.5, y: fy + 1.72, w: 4, h: 0.3, align: "center", fontFace: F, fontSize: 12, color: ACCENT, italic: true, margin: 0 });
// milestones row
s.addText("Framework milestones", { x: M, y: 5.2, w: 6, h: 0.4, fontFace: F, fontSize: 17, color: PRIMARY, bold: true, margin: 0 });
const miles = [["2023", "LangChain, LlamaIndex — chained prompts & tools"], ["2023–24", "Native function calling; multi-agent frameworks"], ["2024–25", "MCP standardizes tool access for every harness"]];
miles.forEach((m, i) => {
  const x = M + i * ((W - 2 * M - 0.8) / 3 + 0.4);
  s.addText(m[0], { x, y: 5.7, w: 3.9, h: 0.35, fontFace: F, fontSize: 15, bold: true, color: ACCENT, margin: 0 });
  s.addText(m[1], { x, y: 6.07, w: 3.7, h: 0.9, fontFace: F, fontSize: 13, color: MUTED, margin: 0 });
});

/* ---------------- 8 · Harness Engineering: representative products ---------------- */
s = p.addSlide(); base(s);
header(s, "STAGE 03 · HARNESS ENGINEERING", "Representative agents");
const prods = [
  ["AutoGPT", "2023 · open source", "The first viral autonomous agent: give it a goal, and it plans, browses, and executes in a loop. Demoed the idea — and the reliability limits — of full autonomy."],
  ["ACPAgent", "2025 · protocol-based", "Built on the Agent Client Protocol: agents that interoperate across clients and editors through a standard handshake, rather than one-off integrations."],
  ["OpenClaw", "2025 · open source", "A personal AI assistant harness that runs locally and connects to messages, tools, and workflows — agents as always-on software you own and extend."],
];
prods.forEach((pr, i) => {
  const x = M + i * (tw + 0.4);
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: tw, h: 4.35, rectRadius: 0.1, fill: { color: CARD }, shadow: shadow() });
  s.addText(pr[0], { x: x + 0.3, y: 2.35, w: tw - 0.6, h: 0.55, fontFace: F, fontSize: 23, bold: true, color: TEXT, margin: 0 });
  s.addText(pr[1], { x: x + 0.3, y: 2.95, w: tw - 0.6, h: 0.35, fontFace: F, fontSize: 13, color: i === 2 ? ACCENT : PRIMARY, bold: true, charSpacing: 1, margin: 0 });
  s.addText(pr[2], { x: x + 0.3, y: 3.45, w: tw - 0.6, h: 2.7, fontFace: F, fontSize: 13.5, color: MUTED, margin: 0 });
});
s.addText("The common thread: value moved from the prompt, through the context, into the system around the model.", { x: M, y: 6.65, w: W - 2 * M, h: 0.4, fontFace: F, fontSize: 15, italic: true, color: PRIMARY, margin: 0 });
timelineTrack(s, 1.62, ["Prompt Engineering", "Context Engineering", "Harness Engineering"], 2);

/* ---------------- 9 · Closing ---------------- */
s = p.addSlide(); base(s);
s.addShape(p.shapes.LINE, { x: M, y: 2.1, w: W - 2 * M, h: 0, line: { color: CARD2, width: 2 } });
const closing = [
  ["PROMPT", "How you ask", "2020–2023"],
  ["CONTEXT", "What the model sees", "2023–2025"],
  ["HARNESS", "Where the agent lives", "2025 →"],
];
closing.forEach((c, i) => {
  const x = M + i * (colW + 0.3);
  s.addShape(p.shapes.OVAL, { x: x + colW / 2 - 0.09, y: 2.01, w: 0.18, h: 0.18, fill: { color: i === 2 ? ACCENT : PRIMARY } });
  s.addText(c[2], { x, y: 2.5, w: colW, h: 0.35, align: "center", fontFace: F, fontSize: 13, color: MUTED, margin: 0 });
  s.addText(c[0], { x, y: 2.9, w: colW, h: 0.5, align: "center", fontFace: F, fontSize: 20, bold: true, color: i === 2 ? ACCENT : TEXT, charSpacing: 2, margin: 0 });
  s.addText(c[1], { x, y: 3.4, w: colW, h: 0.4, align: "center", fontFace: F, fontSize: 14, color: MUTED, margin: 0 });
});
s.addText("Each era didn't replace the last — it wrapped it.", { x: M, y: 4.5, w: W - 2 * M, h: 1.0, align: "center", fontFace: F, fontSize: 34, bold: true, color: TEXT, margin: 0 });
s.addText("Good prompts still matter. Good context still matters. But the frontier is now the harness: the loop, tools, memory, and guardrails that turn a model into an agent.", { x: 2.2, y: 5.6, w: W - 4.4, h: 0.9, align: "center", fontFace: F, fontSize: 15, color: MUTED, margin: 0 });

p.writeFile({ fileName: "/home/shadow/me/ai-agents-deck/The-Evolution-of-AI-Agents.pptx" }).then(() => console.log("done"));
