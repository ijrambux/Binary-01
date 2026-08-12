"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.content },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="header">
        <div className="brand">
          <img
            src="https://pbs.twimg.com/profile_images/2087579313126113281/906ksdnD_400x400.jpg"
            alt="Binary 01"
            className="avatar"
          />
          <div>
            <h1>Binary 01</h1>
            <p>Local intelligence. Public interface.</p>
          </div>
        </div>
        <span className="status">● LOCAL CORE</span>
      </header>

      <section className="chat">
        {messages.length === 0 ? (
          <div className="welcome">
            <h2>Binary 01</h2>
            <p>
              Ask a question. The public interface runs on Vercel while the
              model remains on the private machine.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <article key={index} className={`message ${message.role}`}>
              <div className="role">{message.role === "user" ? "YOU" : "B01"}</div>
              <div className="content">{message.content}</div>
            </article>
          ))
        )}
      </section>

      {error && <div className="error">{error}</div>}

      <form onSubmit={sendMessage} className="composer">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Message Binary 01..."
          maxLength={8000}
          disabled={busy}
          rows={3}
        />
        <button disabled={busy || !input.trim()}>
          {busy ? "Thinking..." : "Send"}
        </button>
      </form>

      <footer>Binary 01 · local model infrastructure</footer>
    </main>
  );
}
