import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pet_type, breed, weight, threat_id, amount, toxicity_ratio, severity } = body;

    // Supabase에 비동기 로그 저장 시도
    const { data, error } = await supabase
      .from("emergency_calculator_logs")
      .insert([
        {
          pet_type,
          breed,
          weight: parseFloat(weight) || 0,
          threat_id,
          amount: parseFloat(amount) || 0,
          toxicity_ratio: parseFloat(toxicity_ratio) || 0,
          severity,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("Supabase logging failed (it's okay if table does not exist yet):", error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Emergency logging API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
