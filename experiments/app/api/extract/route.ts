import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const JobPostingSchema = z.object({
  company: z.string().describe("The hiring company name"),
  jobTitle: z.string().describe("The job title/position"),
  location: z.string().describe("Job location (city, state, country, or remote)"),
  workplaceType: z.enum(["Remote", "Hybrid", "Onsite", "Unknown"]).describe("Work arrangement"),
  employmentType: z.enum(["FullTime", "PartTime", "Contract", "Internship", "Unknown"]).describe("Employment type"),
  experienceLevel: z.string().nullable().describe("Required years of experience or level"),
  salary: z.object({
    min: z.number().nullable(),
    max: z.number().nullable(),
    currency: z.string().nullable(),
  }).nullable().describe("Salary range if available"),
  description: z.string().describe("Brief summary of the role (2-3 sentences)"),
  requirements: z.array(z.string()).describe("Key requirements or qualifications"),
  responsibilities: z.array(z.string()).describe("Main responsibilities"),
  benefits: z.array(z.string()).describe("Benefits offered"),
  applicationUrl: z.string().nullable().describe("Direct application URL if found in the page"),
});

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an expert at structured data extraction. You will be given HTML from a job posting page and should convert it into the given structure. Extract all relevant information accurately.",
        },
        {
          role: "user",
          content: `Extract the job posting information from this HTML:\n\n${html.substring(0, 50000)}`,
        },
      ],
      response_format: zodResponseFormat(JobPostingSchema, "job_posting"),
    });

    const jobPosting = completion.choices[0].message.parsed;

    return NextResponse.json({ jobPosting });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to extract job posting data" },
      { status: 500 }
    );
  }
}

