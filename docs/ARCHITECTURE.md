# Binary 01 Architecture

## Trust boundaries

1. Browser: untrusted.
2. Vercel API route: public edge/server layer.
3. Tunnel: encrypted transport to the private machine.
4. Local Agent: authenticated gateway.
5. LM Studio: localhost-only inference server.
6. Model: local weights.

## Why the browser calls `/api/chat`

The browser must not know the Local Agent URL or its secret. The Next.js server route keeps both in server-side environment variables.

## Why the Local Agent exists

It validates requests and creates a narrow interface to LM Studio. LM Studio itself is never exposed directly.

## Production rule

Never expose port 1234 directly to the Internet.

Never put `LOCAL_AGENT_TOKEN` in `NEXT_PUBLIC_*`.

Never commit `.env` files.
