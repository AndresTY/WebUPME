# WebUPME — Document Q&A Frontend (RAG Client)

A Vue 3 + TypeScript frontend for a Retrieval-Augmented Generation (RAG)
system built to answer questions over institutional documents for
**UPME** (Unidad de Planeación Minero Energética, Colombia's mining and
energy planning agency): upload a PDF, ask questions about it in natural
language, and export the answer as PDF, HTML, or DOCX.

> **Scope note:** this repository contains the client only. The RAG
> pipeline itself (document ingestion, embeddings, vector retrieval, and
> the LLM call) runs as a separate backend service consumed over
> `/api/ask` and `/api/loadPdf` — see [Architecture](#architecture)
> below. If you're looking for the retrieval/inference logic, it isn't
> in this repo.

## What it does

- **Ask a question** (`ModelForm.vue` → `POST /api/ask`): sends the
  question with a `k=7` retrieval parameter, renders the response
  (returned as Markdown, parsed with `marked`) as formatted HTML.
- **Upload a document** (`POST /api/loadPdf`): uploads a PDF (client-side
  validated: type + 10MB size cap) to be ingested into the retrieval
  index.
- **Export the answer** as PDF (`html2pdf.js`), HTML (raw blob download),
  or DOCX (HTML wrapped in Word-compatible XML namespaces, saved via
  `file-saver`) — useful for turning a Q&A session into a shareable
  document for non-technical stakeholders.

## Architecture

```
[Vue 3 SPA]  --/api/ask, /api/loadPdf-->  [dev-server proxy]  -->  [RAG backend :8000]
                                                                       │
                                                            ingestion, embeddings,
                                                            vector retrieval, LLM call
```

In development, `vue.config.js` proxies `/api/*` to the backend
(`pathRewrite` strips the `/api` prefix). In production this proxy target
needs to be replaced with the real backend URL or handled at the reverse
proxy / gateway level — it's currently hardcoded to a LAN IP for local
development.

## Tech stack

- Vue 3 (Composition API, `<script setup>`), TypeScript
- `marked` — Markdown → HTML rendering of LLM responses
- `html2pdf.js` / `file-saver` — client-side document export (PDF/HTML/DOCX)
- FontAwesome for icons

## Running locally

```bash
npm install
npm run serve        # dev server with /api proxy to the RAG backend
```

Requires the RAG backend to be running and reachable at the address
configured in `vue.config.js` (`devServer.proxy['/api'].target`) — update
it to point at your own backend instance.

```bash
npm run build        # production build
npm run lint          # lint + autofix
```

## Author

Andres Santiago Ducuara Velasquez ([@AndresTY](https://github.com/AndresTY))