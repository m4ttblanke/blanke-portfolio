# AI Portfolio Chatbot

**Date:** 2026-03-30  
**Status:** Planning

---

## Overview

Add a terminal-style AI chatbot to the portfolio that can answer visitor questions about projects, experience, and coursework. The bot has access to all published portfolio data and answers in character — concise, technical, and on-brand with the site's hacker aesthetic.

---

## Goals

- Let recruiters and engineers ask specific questions without reading every page ("What did you build at X?", "Do you know Rust?", "What's your most complex project?")
- Surface depth that static cards can't show
- Match the existing terminal / hacker visual language

---

## Architecture

### Data Flow

```
Visitor types question
        ↓
POST /api/chat  (Next.js route handler)
        ↓
Server fetches all published data from Convex
        ↓
Builds system prompt with full portfolio context
        ↓
Streams response from Claude API
        ↓
Client renders tokens as they arrive
```

### Why server-side context injection (not RAG)?

The full dataset is small — a few KB of JSON for projects, experience, and coursework. There is no need for vector embeddings or retrieval at this scale. Injecting everything into the system prompt is simpler, cheaper, and gives the model complete context every time.

Revisit with RAG only if the content grows large enough that context window cost becomes a concern (unlikely for a personal portfolio).

---

## Implementation Plan

### Step 1 — API Route

Create `app/api/chat/route.ts` as a streaming POST endpoint.

**Request body:**
```ts
{ messages: { role: 'user' | 'assistant'; content: string }[] }
```

**On each request:**
1. Validate message array (max ~20 turns, max content length per message)
2. Fetch all published data server-side via Convex `fetchQuery`:
   - `api.projects.listPublished`
   - `api.experience.listPublished`
   - `api.coursework.listPublished`
3. Serialize into a structured system prompt (see below)
4. Call Claude API with streaming enabled
5. Return a `ReadableStream` of SSE tokens

**Rate limiting:** Add a simple in-memory rate limiter (e.g. 10 requests/min per IP) or use Vercel's Edge middleware. This prevents abuse without requiring auth.

**Environment variable needed:**
```
ANTHROPIC_API_KEY=
```

### Step 2 — System Prompt

```
You are an AI assistant on Matt Blanke's portfolio website.
Answer questions about Matt's projects, experience, and coursework.
Be concise and technical. Use first person on Matt's behalf when describing his work.
Do not fabricate details not present in the data below.
If asked something outside the portfolio context, briefly redirect.

--- PROJECTS ---
{projects as formatted JSON or prose}

--- EXPERIENCE ---
{experience as formatted JSON or prose}

--- COURSEWORK ---
{coursework as formatted JSON or prose}
```

Format project entries to include all fields: title, description, stack, dates, repo/live URLs.

### Step 3 — Client Component

Create `components/chat-widget.tsx` — a floating, toggleable terminal-style chat panel.

**Visual spec:**
- Fixed position, bottom-right corner
- Toggle button: terminal icon or `>_` glyph with accent color
- Panel: dark background (`#0d1117`), JetBrains Mono, green accent (`#10b981`)
- Message bubbles styled as terminal output lines
- Streaming tokens rendered in real-time with the existing cursor blink (`▋`)
- Suggested starter prompts shown when no conversation yet (e.g. "What's your most technically complex project?", "What stack do you work in?")

**State:**
```ts
type Message = { role: 'user' | 'assistant'; content: string };
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [streaming, setStreaming] = useState(false);
```

**Streaming implementation:**
Use `fetch` with `ReadableStream` reader to consume SSE tokens and append them to the last assistant message incrementally.

### Step 4 — Wire into Layout

Add `<ChatWidget />` to `app/(public)/layout.tsx` alongside `<BinaryRain />` and `<IntroOrchestrator />`. It should render on all public pages.

---

## File Checklist

```
app/api/chat/route.ts          — streaming POST handler
components/chat-widget.tsx     — floating UI + client state
```

No schema changes needed — reads from existing published queries.

---

## Dependencies

| Package | Purpose |
|---|---|
| `@anthropic-ai/sdk` | Claude API client with streaming support |

No other new dependencies. Convex queries and Next.js streaming are already available.

---

## Open Questions

1. **Persona depth** — Should the bot answer only factual questions or also be able to speculate on Matt's interests/opinions based on context clues in project descriptions?
2. **Conversation history** — Cap at N turns or let it grow? Longer context = more accurate follow-ups but higher token cost.
3. **Visibility** — Should the chat widget be visible immediately, or only appear after the intro sequence finishes?
4. **Admin view** — Worth logging questions to Convex so Matt can see what visitors are asking? Useful signal for improving the portfolio.

---

## Non-Goals

- No user authentication for the chat
- No persistent chat history across sessions
- No fine-tuning or custom model training
- No multi-modal (image uploads, etc.)
