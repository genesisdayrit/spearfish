"use client";

import { useState } from "react";

interface JobPosting {
  company: string;
  jobTitle: string;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "Onsite" | "Unknown";
  employmentType: "FullTime" | "PartTime" | "Contract" | "Internship" | "Unknown";
  experienceLevel: string | null;
  salary: {
    min: number | null;
    max: number | null;
    currency: string | null;
  } | null;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  applicationUrl: string | null;
}

export default function ExtractPage() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [showHtml, setShowHtml] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHtml("");
    setJobPosting(null);

    try {
      // Step 1: Scrape the HTML
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const scrapeData = await scrapeResponse.json();

      if (!scrapeResponse.ok) {
        throw new Error(scrapeData.error || "Failed to fetch");
      }

      setHtml(scrapeData.html);
      setLoading(false);

      // Step 2: Automatically extract job posting data
      setExtracting(true);
      const extractResponse = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: scrapeData.html }),
      });

      const extractData = await extractResponse.json();

      if (!extractResponse.ok) {
        throw new Error(extractData.error || "Failed to extract data");
      }

      setJobPosting(extractData.jobPosting);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setExtracting(false);
    }
  };

  const formatSalary = (salary: JobPosting["salary"]) => {
    if (!salary || (!salary.min && !salary.max)) return "Not specified";
    const currency = salary.currency || "USD";
    const min = salary.min ? `$${salary.min.toLocaleString()}` : "";
    const max = salary.max ? `$${salary.max.toLocaleString()}` : "";
    if (min && max) return `${min} - ${max} ${currency}`;
    if (min) return `${min}+ ${currency}`;
    if (max) return `Up to ${max} ${currency}`;
    return "Not specified";
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
          extract
        </h1>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter job posting URL (e.g., https://jobs.ashbyhq.com/...)"
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              required
            />
            <button
              type="submit"
              disabled={loading || extracting}
              className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {loading ? "Scraping..." : extracting ? "Extracting..." : "Extract Job Data"}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        {html && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-6">
            <button
              onClick={() => setShowHtml(!showHtml)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                📄 Raw HTML Response
              </h2>
              <span className="text-zinc-500 dark:text-zinc-400">
                {showHtml ? "▼" : "▶"}
              </span>
            </button>
            {showHtml && (
              <pre className="overflow-x-auto text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
                {html}
              </pre>
            )}
          </div>
        )}

        {jobPosting && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
              📊 Extracted Job Information
            </h2>

            <div className="space-y-6">
              {/* Company & Title */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {jobPosting.jobTitle}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">{jobPosting.company}</p>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Location</p>
                  <p className="text-zinc-900 dark:text-zinc-100">{jobPosting.location}</p>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Workplace Type</p>
                  <p className="text-zinc-900 dark:text-zinc-100">{jobPosting.workplaceType}</p>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Employment Type</p>
                  <p className="text-zinc-900 dark:text-zinc-100">{jobPosting.employmentType}</p>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Experience Level</p>
                  <p className="text-zinc-900 dark:text-zinc-100">{jobPosting.experienceLevel || "Not specified"}</p>
                </div>
              </div>

              {/* Salary */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Salary Range</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{formatSalary(jobPosting.salary)}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Description</p>
                <p className="text-zinc-900 dark:text-zinc-100">{jobPosting.description}</p>
              </div>

              {/* Requirements */}
              {jobPosting.requirements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Requirements</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-900 dark:text-zinc-100">
                    {jobPosting.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {jobPosting.responsibilities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Responsibilities</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-900 dark:text-zinc-100">
                    {jobPosting.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {jobPosting.benefits.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Benefits</p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-900 dark:text-zinc-100">
                    {jobPosting.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application URL */}
              {jobPosting.applicationUrl && (
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Application URL</p>
                  <a
                    href={jobPosting.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {jobPosting.applicationUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

