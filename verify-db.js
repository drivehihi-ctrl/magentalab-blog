import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function verifyDb() {
  console.log("1. Sending POST request to /api/emergency-log...");
  
  // API Route expects camelCase for V2 fields based on EmergencyCalculator.tsx
  const payload = {
    pet_type: "dog",
    breed: "test",
    weight: 10,
    threat_id: "grape",
    amount: 5,
    toxicity_ratio: null,
    severity: null,
    // API expects camelCase
    decisionMode: "NON_CALCULABLE",
    riskAssessment: "NON_QUANTIFIABLE",
    actionLevel: "PROMPT_VET_CONTACT",
    substanceSubtype: "GRAPE",
    calculatedDose: null,
    doseUnit: null,
    ingredientKnown: true
  };

  try {
    const response = await fetch("http://127.0.0.1:3000/api/emergency-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("POST Response status:", response.status);
    console.log("POST Result:", result);

    if (!result.success) {
      console.error("❌ API returned error");
      return;
    }

    // 2. Verify in Supabase
    console.log("\n2. Checking DB for the inserted row (breed='test')...");
    const { data: fetchRows, error: fetchError } = await supabaseAdmin
      .from('emergency_calculator_logs')
      .select('*')
      .eq('breed', 'test')
      .order('id', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("❌ Failed to fetch from Supabase:", fetchError);
      return;
    }

    if (!fetchRows || fetchRows.length === 0) {
      console.error("❌ No row found in Supabase with breed='test'");
      return;
    }

    const insertedRow = fetchRows[0];
    console.log("✅ Row successfully found in Supabase:", insertedRow);
    
    // 3. Delete the row
    console.log("\n3. Deleting the test row...");
    const { error: deleteError } = await supabaseAdmin
      .from('emergency_calculator_logs')
      .delete()
      .eq('id', insertedRow.id);

    if (deleteError) {
      console.error("❌ Failed to delete the test row:", deleteError);
    } else {
      console.log(`✅ Successfully deleted test row (id: ${insertedRow.id})!`);
    }

  } catch (error) {
    console.error("❌ Error during verification:", error);
  }
}

verifyDb();
