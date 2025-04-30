import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateApiKey } from "@/lib/utils";

export async function GET() {
  try {
    const { data: apiKeys, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log("Retrieved API keys:", apiKeys);
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Log the raw request body for debugging
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);

    // Parse the JSON body
    const body = JSON.parse(rawBody);
    const { name, type = "development" } = body;

    console.log("Parsed request body:", { name, type });

    if (!name) {
      console.log("Name is required but was not provided");
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Get the current maximum ID
    const { data: maxIdResult, error: maxIdError } = await supabase
      .from("api_keys")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (maxIdError && maxIdError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      console.error("Error getting max ID:", maxIdError);
      return NextResponse.json(
        { error: "Failed to generate new ID", details: maxIdError.message },
        { status: 500 }
      );
    }

    // Calculate next ID (start with 1 if no existing keys)
    const nextId = maxIdResult ? maxIdResult.id + 1 : 1;

    // Generate API key using the shared utility function
    const generatedKey = generateApiKey(type);
    console.log("Generated key with prefix:", generatedKey);

    const newKey = {
      id: nextId,
      name,
      key: generatedKey,
      type,
      created_at: new Date().toISOString(),
    };

    console.log("Attempting to insert key:", newKey);

    const { data, error } = await supabase
      .from("api_keys")
      .insert([newKey])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create API key", details: error.message },
        { status: 500 }
      );
    }

    console.log("Successfully created key:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      {
        error: "Failed to create API key",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
