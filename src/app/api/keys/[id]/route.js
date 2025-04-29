import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// In-memory storage for API keys (replace with database in production)
let apiKeys = [];

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { error } = await supabase.from("api_keys").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();

    const { data, error } = await supabase
      .from("api_keys")
      .update({
        name: updates.name,
        type: updates.type,
        usage_limit: updates.usageLimit,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { error: "Failed to update API key" },
      { status: 500 }
    );
  }
}
