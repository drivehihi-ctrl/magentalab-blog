import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const endpoint = 'https://www.magentalabblog.com/api/mcp';
const secret = process.env.AI_CONTENT_API_SECRET;

async function sendRequest(method, params = {}, headers = {}) {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
            ...headers
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: Math.random().toString(36).substr(2, 9),
            method,
            params
        })
    });
    return res;
}

function parseResult(resData) {
    if (resData.result?.isError || resData.error) return null;
    if (!resData.result?.content?.[0]?.text) return null;
    try {
        return JSON.parse(resData.result.content[0].text);
    } catch {
        return resData.result.content[0].text;
    }
}

async function runAuditTest() {
    console.log(`Starting Positive Path Audit Test against: ${endpoint}`);
    
    const wpId = 5800; // As suggested by the user
    console.log(`Testing magentalab_get_audit with WP ID: ${wpId}`);

    const resD = await sendRequest("tools/call", { name: "magentalab_get_audit", arguments: { wordpress_id: wpId } }, { 'Authorization': `Bearer ${secret}` });
    let jsonD = {};
    if (resD.ok) jsonD = await resD.json();
    
    const auditD = parseResult(jsonD);
    
    console.log(`HTTP: ${resD.status}`);
    console.log(`MCP isError: ${!!jsonD.result?.isError}`);
    console.log("Expected field/value: quality_score(number), evidence_score(number), medical_risk(number), medical_risk_level, status, recommended_action");
    
    let actualFieldsStr = "null";
    let pass = false;
    
    if (auditD && Object.keys(auditD).length > 0) {
        actualFieldsStr = `quality_score=${auditD.quality_score}, evidence_score=${auditD.evidence_score}, medical_risk=${auditD.medical_risk}, medical_risk_level=${auditD.medical_risk_level}, status=${auditD.status}, recommended_action=${auditD.recommended_action}`;
        
        if (typeof auditD.quality_score === 'number' &&
            typeof auditD.evidence_score === 'number' &&
            typeof auditD.medical_risk === 'number' &&
            auditD.medical_risk_level !== undefined &&
            auditD.status !== undefined &&
            auditD.recommended_action !== undefined) {
            pass = true;
        }
    } else {
        actualFieldsStr = "{} (Empty Object)";
    }
    
    console.log(`Actual field/value: ${actualFieldsStr}`);
    console.log(`PASS/FAIL: ${pass ? 'PASS' : 'FAIL'}`);
}

runAuditTest().catch(console.error);
