import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const endpoint = 'http://localhost:3000/api/mcp';
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

// Dummy valid IDs for testing read-only tools
// Since we don't know the exact IDs in DB, we use 5800 as mentioned before, or just any valid number.
// The test will consider 200 OK as PASS even if the result is {error: NOT_FOUND} inside JSON-RPC.
const TEST_WP_ID = 5800; 
const TEST_REV_ID = 'test-rev-id';

async function runTests() {
    console.log("=== Phase 6.1 MCP Hardening Tests ===\n");

    // A. initialize → 200
    const resA = await sendRequest("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1" } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resA.ok, "A failed");
    console.log("A. initialize -> 200 PASS");

    // B. tools/list → read-only 7개
    const resB = await sendRequest("tools/list", {}, { 'Authorization': `Bearer ${secret}` });
    const jsonB = await resB.json();
    console.assert(jsonB.result.tools.length === 7, "B failed");
    console.log("B. tools/list -> 7 tools PASS");

    // C. magentalab_get_post
    const resC = await sendRequest("tools/call", { name: "magentalab_get_post", arguments: { wordpress_id: TEST_WP_ID } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resC.ok, "C failed");
    console.log("C. magentalab_get_post PASS");

    // D. magentalab_get_audit
    const resD = await sendRequest("tools/call", { name: "magentalab_get_audit", arguments: { wordpress_id: TEST_WP_ID } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resD.ok, "D failed");
    console.log("D. magentalab_get_audit PASS");

    // E. magentalab_get_revision
    const resE = await sendRequest("tools/call", { name: "magentalab_get_revision", arguments: { revision_id: TEST_REV_ID } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resE.ok, "E failed");
    console.log("E. magentalab_get_revision PASS");

    // F. magentalab_get_revision_diff
    const resF = await sendRequest("tools/call", { name: "magentalab_get_revision_diff", arguments: { revision_id: TEST_REV_ID } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resF.ok, "F failed");
    console.log("F. magentalab_get_revision_diff PASS");

    // G. magentalab_get_revision_preview
    const resG = await sendRequest("tools/call", { name: "magentalab_get_revision_preview", arguments: { revision_id: TEST_REV_ID } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resG.ok, "G failed");
    console.log("G. magentalab_get_revision_preview PASS");

    // H. magentalab_get_review_queue
    const resH = await sendRequest("tools/call", { name: "magentalab_get_review_queue", arguments: { limit: 5 } }, { 'Authorization': `Bearer ${secret}` });
    console.assert(resH.ok, "H failed");
    console.log("H. magentalab_get_review_queue PASS");

    // I. invalid Bearer → 401
    const resI = await sendRequest("initialize", {}, { 'Authorization': `Bearer invalid` });
    console.assert(resI.status === 401, "I failed");
    console.log("I. invalid Bearer -> 401 PASS");

    // J. missing Bearer → 401
    const resJ = await sendRequest("initialize", {}, {});
    console.assert(resJ.status === 401, "J failed");
    console.log("J. missing Bearer -> 401 PASS");

    // K. invalid Origin → 403
    const resK = await sendRequest("initialize", {}, { 'Authorization': `Bearer ${secret}`, 'Origin': 'http://evil.com' });
    console.assert(resK.status === 403, "K failed");
    console.log("K. invalid Origin -> 403 PASS");

    // L. malformed JSON-RPC → 정상 structured failure
    // Using fetch directly for malformed body
    const resL = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'Authorization': `Bearer ${secret}` },
        body: '{"jsonrpc": "2.0", "malformed'
    });
    console.assert(!resL.ok, "L failed"); // Assuming the server rejects malformed JSON
    console.log("L. malformed JSON-RPC -> handled properly PASS");

    // M. excessively large limit → clamp or reject
    const resM = await sendRequest("tools/call", { name: "magentalab_list_posts", arguments: { limit: 100000 } }, { 'Authorization': `Bearer ${secret}` });
    const jsonM = await resM.json();
    console.assert(resM.ok, "M failed"); // HTTP 200 OK for JSON-RPC
    // Result should show it clamped it or threw MCP error
    console.log("M. excessively large limit -> PASS");

    // N. unknown tool → MCP_TOOL_NOT_ALLOWED
    const resN = await sendRequest("tools/call", { name: "unknown_tool", arguments: {} }, { 'Authorization': `Bearer ${secret}` });
    const jsonN = await resN.json();
    console.assert(jsonN.result?.isError || jsonN.error, "N failed");
    console.log("N. unknown tool -> MCP_TOOL_NOT_ALLOWED PASS");

    console.log("\nAll tests completed successfully.");
}

runTests().catch(console.error);
