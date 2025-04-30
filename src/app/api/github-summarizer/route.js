import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    // Debug: Try multiple methods to get headers
    const headersList = headers();
    const headerEntries = Object.fromEntries(request.headers.entries());

    console.log(
      "Headers from next/headers:",
      Object.fromEntries(headersList.entries())
    );
    console.log("Headers from request:", headerEntries);

    const body = await request.json();
    const { githubUrl } = body;

    // Try multiple methods to get the API key
    const key =
      request.headers.get("x-api-key") ||
      headersList.get("x-api-key") ||
      headerEntries["x-api-key"];

    console.log("API Key found:", key);

    // Validate API key
    if (!key) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Validate GitHub URL
    if (!githubUrl) {
      return NextResponse.json(
        { error: "GitHub URL is required" },
        { status: 400 }
      );
    }

    // Verify API key
    const { data: apiKey, error: keyError } = await supabase
      .from("api_keys")
      .select("id, name, type, created_at, usage_limit, usage")
      .eq("key", key)
      .single();

    if (keyError || !apiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Check usage limits if they exist
    if (apiKey.usage_limit && apiKey.usage >= apiKey.usage_limit) {
      return NextResponse.json(
        { error: "API key usage limit exceeded" },
        { status: 429 }
      );
    }

    // TODO: Implement GitHub repository summarization logic here
    // For now, we'll return a mock response
    const summary = {
      repository: githubUrl,
      stars: 1000,
      forks: 500,
      lastUpdated: new Date().toISOString(),
      description:
        "This is a placeholder summary. Implement actual GitHub API integration here.",
    };

    // Update usage count
    await supabase
      .from("api_keys")
      .update({ usage: apiKey.usage + 1 })
      .eq("id", apiKey.id);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error in GitHub summarizer:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
