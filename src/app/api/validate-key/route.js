import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { valid: false, error: "API key is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, type, created_at")
      .eq("key", key)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { valid: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      key: {
        id: data.id,
        name: data.name,
        type: data.type,
        created_at: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error validating API key:", error);
    return NextResponse.json(
      { valid: false, error: "Error validating API key" },
      { status: 500 }
    );
  }
}
