export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 8000;

export async function POST(request: NextRequest) {
  const agentUrl = process.env.LOCAL_AGENT_URL;
  const token = process.env.LOCAL_AGENT_TOKEN;

  if (!agentUrl || !token) {
    return NextResponse.json(
      { error: "Binary 01 backend is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !Array.isArray((body as { messages?: unknown }).messages)
  ) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  const messages = (body as { messages: unknown[] }).messages;

  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Invalid message count." }, { status: 400 });
  }

  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      !["user", "assistant", "system"].includes(
        String((message as { role?: unknown }).role)
      ) ||
      typeof (message as { content?: unknown }).content !== "string" ||
      (message as { content: string }).content.length > MAX_MESSAGE_CHARS
    ) {
      return NextResponse.json({ error: "Invalid message." }, { status: 400 });
    }
  }

  try {
    const response = await fetch(`${agentUrl.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
      cache: "no-store",
      signal: AbortSignal.timeout(120_000),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Local agent rejected the request." },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    return NextResponse.json({ content: data.content });
  } catch {
    return NextResponse.json(
      { error: "Binary 01 could not reach the local model." },
      { status: 502 }
    );
  }
}
