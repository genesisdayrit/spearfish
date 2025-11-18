# Job Posting Extractor Setup

## Overview
The extract experiment uses OpenAI's Structured Outputs to automatically extract structured job posting data from any job posting URL.

## Setup

### 1. Add your OpenAI API Key

Create a `.env.local` file in the `/experiments` directory:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 2. Restart your dev server

```bash
npm run dev
```

## How It Works

1. Navigate to `/experiments` and click on the "extract" card
2. Enter a job posting URL (e.g., from Ashby, Greenhouse, Lever, etc.)
3. The system will:
   - Automatically scrape the HTML
   - Send it to OpenAI's GPT-4o model with structured outputs
   - Extract key information into a structured format
   - Display the extracted data in a clean UI
4. The raw HTML is available in a collapsible section below

## What Gets Extracted

- **Company name**
- **Job title**
- **Location**
- **Workplace type** (Remote/Hybrid/Onsite)
- **Employment type** (Full-time/Part-time/Contract/Internship)
- **Experience level**
- **Salary range** (if available)
- **Job description**
- **Requirements** (as a list)
- **Responsibilities** (as a list)
- **Benefits** (as a list)
- **Application URL**

## API Endpoints

### `/api/scrape` (POST)
Fetches HTML from a given URL.

**Request:**
```json
{
  "url": "https://example.com/job"
}
```

**Response:**
```json
{
  "html": "<html>..."
}
```

### `/api/extract` (POST)
Extracts structured job posting data from HTML using OpenAI.

**Request:**
```json
{
  "html": "<html>...</html>"
}
```

**Response:**
```json
{
  "jobPosting": {
    "company": "Brellium",
    "jobTitle": "Software Engineer - AI",
    "location": "New York City",
    "workplaceType": "Hybrid",
    "employmentType": "FullTime",
    "experienceLevel": "0-6 years",
    "salary": {
      "min": 125000,
      "max": 185000,
      "currency": "USD"
    },
    "description": "...",
    "requirements": [...],
    "responsibilities": [...],
    "benefits": [...],
    "applicationUrl": "..."
  }
}
```

## Schema Details

The extraction uses OpenAI's Structured Outputs with Zod schema validation. The schema is defined in `/app/api/extract/route.ts` and ensures that:

- All responses follow a strict structure
- Enums are validated (e.g., workplaceType can only be Remote/Hybrid/Onsite/Unknown)
- Nullable fields are properly handled
- Arrays are properly formatted

## Notes

- The model used is `gpt-4o-2024-08-06` which supports structured outputs
- HTML is truncated to 50,000 characters to stay within token limits
- The extraction is automatic after scraping (no manual trigger needed)
- The raw HTML is collapsible to keep the UI clean

