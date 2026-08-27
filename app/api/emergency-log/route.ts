import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 서버사이드 API이므로 Service Role Key를 사용하여 RLS를 우회하고 로그를 안전하게 기록합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      pet_type, breed, weight, threat_id, amount, toxicity_ratio, severity,
      // V2 fields
      species, weightKg, substance, substanceSubtype, ingestionAmount, 
      decisionMode, riskAssessment, actionLevel, calculatedDose, doseUnit, ingredientKnown 
    } = body;

    // Supabase에 비동기 로그 저장 시도
    const { data, error } = await supabaseAdmin
      .from("emergency_calculator_logs")
      .insert([
        {
          // V1 fields
          pet_type: pet_type || species,
          breed,
          weight: parseFloat(weight) || parseFloat(weightKg) || 0,
          threat_id: threat_id || substance,
          amount: parseFloat(amount) || parseFloat(ingestionAmount) || 0,
          toxicity_ratio: parseFloat(toxicity_ratio) || 0,
          severity,
          
          // V2 new fields (nullable additive migration)
          decision_mode: decisionMode,
          risk_assessment: riskAssessment,
          action_level: actionLevel,
          substance_subtype: substanceSubtype,
          calculated_dose: calculatedDose,
          dose_unit: doseUnit,
          ingredient_known: ingredientKnown,
          
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
