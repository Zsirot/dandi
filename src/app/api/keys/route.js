import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: apiKeys, error } = await supabase
      .from("api_keys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

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
    const { name, type = "development", usageLimit } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newKey = {
      id: uuidv4(),
      name,
      key: `dandi-${type === "production" ? "prod" : "dev"}-${uuidv4()}`,
      type,
      usage_limit: usageLimit,
      created_at: new Date().toISOString(),
      usage: 0,
    };

    const { data, error } = await supabase
      .from("api_keys")
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}
