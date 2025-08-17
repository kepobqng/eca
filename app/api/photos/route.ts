import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Retrieve all photos
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

// POST - Add new photo
export async function POST(request: NextRequest) {
  try {
    const { photoData, fileName, fileType, description } = await request.json();

    if (!photoData || !fileName) {
      return NextResponse.json(
        { error: "Photo data and filename are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("photos")
      .insert([
        {
          data: photoData,
          file_name: fileName,
          file_type: fileType,
          description: description || "",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}
