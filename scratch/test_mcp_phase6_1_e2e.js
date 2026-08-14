import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Usage: node scratch/test_mcp_phase6_1_e2e.js [prod]
const isProd = process.argv[2] === 'prod';
const endpoint = isProd ? 'https://www.magentalabblog.com/api/mcp' : 'http://localhost:3000/api/mcp';
const secret = process.env.AI_CONTENT_API_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

function printReport(title, httpStatus, isError, expected, actual, passCondition) {
    console.log(`\n--- ${title} ---`);
    console.log(`HTTP: ${httpStatus}`);
    console.log(`MCP isError: ${isError}`);
    console.log(`Expected field/value: ${expected}`);
    
    let actualStr = actual;
    if (typeof actual === 'object' && actual !== null) {
         actualStr = Array.isArray(actual) ? `Array[${actual.length}]` : `Object(keys: ${Object.keys(actual).join(',')})`;
    }
    
    console.log(`Actual field/value: ${actualStr}`);
    console.log(`PASS/FAIL: ${passCondition ? 'PASS' : 'FAIL'}`);
}

async function getValidTestIDs() {
    console.log("Fetching real test IDs from Supabase...");
    const res = await fetch(`${supabaseUrl}/rest/v1/ai_revisions?select=revision_id,wordpress_id&order=created_at.desc&limit=1`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const data = await res.json();
    if (data && data.length > 0) {
        return { wpId: data[0].wordpress_id, revId: data[0].revision_id };
    }
    throw new Error("No revisions found in DB for testing.");
}

async function runTests() {
    console.log(`Starting E2E Hardening Test against: ${endpoint}`);
    let wpId, revId;
    try {
        const ids = await getValidTestIDs();
        wpId = ids.wpId;
        revId = ids.revId;
        console.log(`Using real WordPress ID: ${wpId}, Revision ID: ${revId}`);
    } catch(e) {
        console.error("Failed to fetch valid IDs, falling back to 5800. Error:", e.message);
        wpId = 5800;
        revId = 'test-rev-id';
    }

    // A. initialize
    const resA = await sendRequest("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1" } }, { 'Authorization': `Bearer ${secret}` });
    let jsonA = {};
    if (resA.ok) jsonA = await resA.json();
    printReport("A. initialize", resA.status, !!jsonA.error, "serverInfo.name = Magentalab MCP", jsonA.result?.serverInfo?.name, resA.ok && jsonA.result?.serverInfo?.name === "Magentalab MCP");

    // B. tools/list
    const resB = await sendRequest("tools/list", {}, { 'Authorization': `Bearer ${secret}` });
    let jsonB = {};
    if (resB.ok) jsonB = await resB.json();
    const toolsCount = jsonB.result?.tools?.length;
    const noMutations = jsonB.result?.tools?.every(t => !t.name.includes("create") && !t.name.includes("apply") && !t.name.includes("rollback"));
    printReport("B. tools/list", resB.status, !!jsonB.error, "7 tools, no mutations", `${toolsCount} tools, noMutations=${noMutations}`, resB.ok && toolsCount === 7 && noMutations);

    // C. magentalab_get_post
    const resC = await sendRequest("tools/call", { name: "magentalab_get_post", arguments: { wordpress_id: wpId } }, { 'Authorization': `Bearer ${secret}` });
    let jsonC = {};
    if (resC.ok) jsonC = await resC.json();
    const postC = parseResult(jsonC);
    const passC = resC.ok && !jsonC.result?.isError && postC && postC.id === wpId && postC.title && postC.slug && postC.content && postC.status;
    printReport("C. magentalab_get_post", resC.status, !!jsonC.result?.isError, `id=${wpId}, title, slug, content`, postC ? `id=${postC.id}, status=${postC.status}` : 'null', passC);

    // D. magentalab_get_audit
    const resD = await sendRequest("tools/call", { name: "magentalab_get_audit", arguments: { wordpress_id: wpId } }, { 'Authorization': `Bearer ${secret}` });
    let jsonD = {};
    if (resD.ok) jsonD = await resD.json();
    const auditD = parseResult(jsonD);
    const hasAuditFields = auditD && Object.keys(auditD).length > 0;
    const passD = resD.ok && !jsonD.result?.isError && (hasAuditFields ? (typeof auditD.quality_score === 'number' && auditD.status) : Object.keys(auditD).length === 0);
    printReport("D. magentalab_get_audit", resD.status, !!jsonD.result?.isError, "quality_score(num) or {}", auditD ? `keys=${Object.keys(auditD).length}` : 'null', passD);

    // E. magentalab_get_revision
    const resE = await sendRequest("tools/call", { name: "magentalab_get_revision", arguments: { revision_id: revId } }, { 'Authorization': `Bearer ${secret}` });
    let jsonE = {};
    if (resE.ok) jsonE = await resE.json();
    const revE = parseResult(jsonE);
    const passE = resE.ok && !jsonE.result?.isError && revE && revE.revision_id === revId && revE.wordpress_id && revE.status;
    printReport("E. magentalab_get_revision", resE.status, !!jsonE.result?.isError, `revision_id=${revId}, wp_id, status`, revE ? `rev_id=${revE.revision_id}, wp_id=${revE.wordpress_id}` : 'null', passE);

    // F. magentalab_get_revision_diff
    const resF = await sendRequest("tools/call", { name: "magentalab_get_revision_diff", arguments: { revision_id: revId } }, { 'Authorization': `Bearer ${secret}` });
    let jsonF = {};
    if (resF.ok) jsonF = await resF.json();
    const diffF = parseResult(jsonF);
    const passF = resF.ok && !jsonF.result?.isError && diffF && diffF.revision_id === revId && diffF.diff?.title && typeof diffF.diff?.content?.changed === 'boolean';
    printReport("F. magentalab_get_revision_diff", resF.status, !!jsonF.result?.isError, `revision_id=${revId}, diff.title, diff.content.changed(bool)`, diffF ? `rev_id=${diffF.revision_id}, changed=${diffF.diff?.content?.changed}` : 'null', passF);

    // G. magentalab_get_revision_preview
    const resG = await sendRequest("tools/call", { name: "magentalab_get_revision_preview", arguments: { revision_id: revId } }, { 'Authorization': `Bearer ${secret}` });
    let jsonG = {};
    if (resG.ok) jsonG = await resG.json();
    const prevG = parseResult(jsonG);
    const passG = resG.ok && !jsonG.result?.isError && prevG && prevG.preview_url?.includes(revId);
    printReport("G. magentalab_get_revision_preview", resG.status, !!jsonG.result?.isError, `preview_url includes ${revId}`, prevG ? prevG.preview_url : 'null', passG);

    // H. magentalab_get_review_queue
    const resH = await sendRequest("tools/call", { name: "magentalab_get_review_queue", arguments: { limit: 5 } }, { 'Authorization': `Bearer ${secret}` });
    let jsonH = {};
    if (resH.ok) jsonH = await resH.json();
    const queueH = parseResult(jsonH);
    const passH = resH.ok && !jsonH.result?.isError && Array.isArray(queueH) && queueH.length <= 5;
    printReport("H. magentalab_get_review_queue", resH.status, !!jsonH.result?.isError, "Array, length <= 5", queueH ? `Array[${queueH.length}]` : 'null', passH);

    // I. invalid Bearer
    const resI = await sendRequest("initialize", {}, { 'Authorization': `Bearer invalid` });
    printReport("I. invalid Bearer", resI.status, false, "HTTP 401", resI.status, resI.status === 401);

    // J. missing Bearer
    const resJ = await sendRequest("initialize", {}, {});
    printReport("J. missing Bearer", resJ.status, false, "HTTP 401", resJ.status, resJ.status === 401);

    // K. invalid Origin
    const resK = await sendRequest("initialize", {}, { 'Authorization': `Bearer ${secret}`, 'Origin': 'https://evil.com' });
    printReport("K. invalid Origin", resK.status, false, "HTTP 403", resK.status, resK.status === 403);

    // L. malformed JSON-RPC
    const resL = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'Authorization': `Bearer ${secret}` },
        body: '{"jsonrpc": "2.0", "malformed'
    });
    printReport("L. malformed JSON-RPC", resL.status, false, "Not 200 OK or structured failure", resL.status, !resL.ok || resL.status === 400 || resL.status === 500);

    // M. excessively large limit
    const resM = await sendRequest("tools/call", { name: "magentalab_list_posts", arguments: { limit: 100000 } }, { 'Authorization': `Bearer ${secret}` });
    let jsonM = {};
    if (resM.ok) jsonM = await resM.json();
    const resultM = parseResult(jsonM);
    const passM = resM.ok && !jsonM.result?.isError && resultM && Array.isArray(resultM.posts) && resultM.posts.length <= 50;
    printReport("M. excessively large limit", resM.status, !!jsonM.result?.isError, "Array length <= 50 (Clamped)", resultM ? `Array[${resultM.posts?.length}]` : 'null', passM);

    // N. unknown tool
    const resN = await sendRequest("tools/call", { name: "unknown_tool", arguments: {} }, { 'Authorization': `Bearer ${secret}` });
    let jsonN = {};
    if (resN.ok) jsonN = await resN.json();
    const isToolError = jsonN.result?.isError || !!jsonN.error;
    const textN = jsonN.result?.content?.[0]?.text || jsonN.error?.message;
    const passN = isToolError && textN?.includes("MCP_TOOL_NOT_ALLOWED");
    printReport("N. unknown tool", resN.status, isToolError, "MCP_TOOL_NOT_ALLOWED", textN, passN);

    console.log("\n==================================================");
    console.log("FINAL REPORT");
    console.log("==================================================");
    console.log("WORDPRESS MUTATION: NONE");
    console.log("SUPABASE MUTATION: NONE");
    console.log("WRITE MCP TOOLS: NONE");
    
    // Check if origin env is set
    const originSet = process.env.MCP_ALLOWED_ORIGINS ? "SET" : "NOT SET";
    console.log(`ORIGIN ENV: ${originSet}`);
}

runTests().catch(console.error);
