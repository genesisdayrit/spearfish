"use client";

import { useState } from "react";

export default function ScraperPage() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHtml("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setHtml(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
          scraper
        </h1>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter webpage URL (e.g., https://example.com)"
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Scrape"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {html && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8">
            <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-4">
              HTML Response
            </h2>
            <pre className="overflow-x-auto text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-words">
              {html}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

