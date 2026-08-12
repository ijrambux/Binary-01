# Binary 01 Deployment

## GitHub

Push this project to a repository named `Binary-01`.

## Vercel

Import the GitHub repository.

Set server-side environment variables:

```text
LOCAL_AGENT_URL=https://YOUR-SECURE-TUNNEL-ENDPOINT
LOCAL_AGENT_TOKEN=YOUR_LONG_RANDOM_SECRET
```

Do not prefix them with `NEXT_PUBLIC_`.

## Local machine

Run LM Studio and Local Agent.

LM Studio:
- server on `127.0.0.1:1234`
- model loaded

Local Agent:
- `127.0.0.1:8787`

A secure HTTPS tunnel must forward only the Local Agent port.

The exact tunnel provider/configuration is intentionally left outside the application source because it requires the owner's account/domain/credentials.

## Verification order

1. LM Studio local endpoint works.
2. Local Agent `/health` works.
3. Local Agent `/chat` works with the secret.
4. Tunnel reaches Local Agent.
5. Vercel `/api/chat` reaches the tunnel.
6. Browser chat works.

Never debug all six layers at once. Humans have suffered enough from that particular tradition.
