# Binary 01 Local Agent

Small security boundary between Vercel and LM Studio.

## Run

```bash
npm install
```

Copy `.env.example` to `.env`, then set:

- `LM_MODEL`: exact model id shown by LM Studio
- `LOCAL_AGENT_TOKEN`: long random secret

Start:

```bash
npm start
```

The agent deliberately binds to `127.0.0.1`.

## Test locally

```bash
curl http://127.0.0.1:8787/health
```

Then test the authenticated chat endpoint after LM Studio is running.
