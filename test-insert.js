async function testApi() {
  console.log("Sending test log to /api/emergency-log...");
  
  try {
    const response = await fetch("http://127.0.0.1:3000/api/emergency-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        species: "dog",
        weightKg: 10,
        substance: "chocolate",
        substanceSubtype: "MILK_CHOCOLATE",
        ingestionAmount: 100,
        decisionMode: "CALCULATED",
        riskAssessment: "CLINICAL_SIGNS_POSSIBLE",
        actionLevel: "CONTACT_VET",
        calculatedDose: 23.0,
        doseUnit: "mg/kg",
        ingredientKnown: true
      })
    });

    const result = await response.json();
    console.log("Result:", result);

    if (result.success) {
      console.log("✅ Successfully inserted test log via API Route!");
    } else {
      console.error("❌ Failed to insert test log:", result.error);
    }
  } catch (error) {
    console.error("❌ Network or fetch error:", error);
  }
}

testApi();
