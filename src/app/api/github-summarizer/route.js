import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    // Test Supabase connection
    console.log("Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase
      .from("api_keys")
      .select("*")
      .limit(10);

    if (testError) {
      console.error("Supabase connection test failed:", testError);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    console.log("Available API keys in database:", testData);

    // Debug: Log all available headers
    const headersList = await headers();
    const allHeaders = Array.from(headersList.entries());
    console.log("All available headers:", allHeaders);

    // Try to get the API key from raw headers
    const rawHeaders = request.headers;
    console.log("Raw headers:", rawHeaders);

    // Try multiple methods to get the API key
    const apiKeyFromRaw = rawHeaders.get("x-api-key");
    const apiKeyFromHeaders = headersList.get("x-api-key");

    console.log("API key from raw headers:", apiKeyFromRaw);
    console.log("API key from headers():", apiKeyFromHeaders);

    // Get API key from header
    const key = headersList.get("x-api-key");
    console.log("Received API key from header:", key);

    // Get request body
    const body = await request.json();
    const { githubUrl } = body;

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

    // Verify API key using the same query as validate-key endpoint
    console.log("Querying Supabase for key:", key);
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, type, created_at")
      .eq("key", key)
      .single();

    console.log("Supabase response:", { data, error });

    if (error || !data) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Fetch README content
    const readmeContent = await getGitHubReadme(githubUrl);

    // Create summary with actual README content
    const summary = {
      repository: githubUrl,
      stars: 1000, // TODO: Fetch actual stars count from GitHub API
      forks: 500, // TODO: Fetch actual forks count from GitHub API
      lastUpdated: new Date().toISOString(),
      description: readmeContent || "No README content available",
    };

    // Update usage count if needed
    await supabase
      .from("api_keys")
      .update({ usage: (data.usage || 0) + 1 })
      .eq("id", data.id);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error in GitHub summarizer:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}

async function getGitHubReadme(githubUrl) {
  try {
    // Parse owner and repo from GitHub URL
    const urlParts = githubUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Fetch README content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "Dandi-App",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch README");
    }

    const readmeContent = await response.text();
    console.log(readmeContent);
    return readmeContent;
  } catch (error) {
    console.error("Error fetching GitHub README:", error);
    return null;
  }
}
