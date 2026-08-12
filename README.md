# Binary 01

A public web interface on Vercel that talks to a local LM Studio model through a private Local Agent.

## Architecture

Browser → Vercel `/api/chat` → secure tunnel → Local Agent → LM Studio → local model

The browser never receives the Local Agent URL or secret token.

## Requirements

- Node.js 20+
- LM Studio
- A downloaded and loaded chat model
- LM Studio server enabled on `127.0.0.1:1234`

## 1. Web app

```bash
npm install
cp .env.example .env.local
npm run dev
```

For Vercel, set the same server-only variables in Project Settings → Environment Variables.

## 2. Local Agent

```bash
cd local-agent
npm install
copy .env.example .env
npm start
```

Linux/macOS:

```bash
cp .env.example .env
npm start
```

The agent listens on `127.0.0.1:8787` by default. Do not bind it to `0.0.0.0`.

## 3. LM Studio

In LM Studio, start the local server on `127.0.0.1:1234`, load a model, and verify the OpenAI-compatible endpoint is available.

Set `LM_MODEL` in the local agent to the model identifier shown by LM Studio.

## 4. Public connection

Vercel cannot directly reach `127.0.0.1` on your PC. The production deployment therefore needs a secure outbound tunnel from the PC to the Local Agent.

Put the resulting HTTPS endpoint in Vercel:

`LOCAL_AGENT_URL=https://your-private-agent-endpoint.example`

Set the exact same secret in:

`LOCAL_AGENT_TOKEN=...`

Do not put either variable in a `NEXT_PUBLIC_*` variable.

## Security

- LM Studio stays on localhost.
- Local Agent stays on localhost.
- Vercel is the public web layer.
- The Local Agent requires a bearer token.
- Input length and request body size are limited.
- The Vercel route does not expose the agent URL to the browser.
- Never commit `.env`, `.env.local`, or `.env.*.local`.

## Important

This starter intentionally does not include a public tunnel configuration because tunnel credentials and domain choices are deployment-specific. The application is ready for one to be added without changing the chat UI.
