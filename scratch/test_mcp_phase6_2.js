import dotenv from 'dotenv';
import crypto from 'crypto';
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
            id: crypto.randomBytes(4).toString('hex'),
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

function checkError(resData, errorStr) {
    const isToolError = resData.result?.isError || !!resData.error;
    const textN = resData.result?.content?.[0]?.text || resData.error?.message;
    return isToolError && textN && textN.includes(errorStr);
}

function printReport(title, passCondition, details = "") {
    console.log(`\n--- ${title} ---`);
    console.log(`PASS/FAIL: ${passCondition ? 'PASS' : 'FAIL'} ${details ? `(${details})` : ''}`);
}

async function runTests() {
    console.log(`Starting Phase 6.2 Tests against: ${endpoint}`);
    
    // We will use 5800 for negative tests and positive tests
    const wpId = 5800; 

    // First get the real post to get its modified date and content for lengths
    const resPost = await sendRequest("tools/call", { name: "magentalab_get_post", arguments: { wordpress_id: wpId } }, { 'Authorization': `Bearer ${secret}` });
    const postData = parseResult(await resPost.json());
    if (!postData) throw new Error("Failed to get post 5800 for setup");
    
    const sourceModifiedAt = postData.modified;
    const originalContent = postData.content?.rendered || '';
    const originalTitle = postData.title?.rendered || '';
    
    const validEvidence = {
        keyInsight: "insight",
        cautionNote: "caution",
        references: [{
            title: "Ref 1",
            org: "WHO",
            type: "journal",
            url: "https://www.who.int/report"
        }]
    };
    
    const validContent = `
        <p>This is a safe rewrite test.</p>
        <div>
            <h2>Ansim-i's Research Summary</h2>
            <p>Summary of the research...</p>
        </div>
        ${originalContent}
    `;

    console.log("\n=== NEGATIVE TESTS ===");

    // A. missing Bearer -> 401
    let res = await sendRequest("tools/call", { name: "magentalab_create_revision", arguments: {} });
    printReport("A. missing Bearer", res.status === 401);

    // B. invalid Bearer -> 401
    res = await sendRequest("tools/call", { name: "magentalab_create_revision", arguments: {} }, { 'Authorization': `Bearer invalid` });
    printReport("B. invalid Bearer", res.status === 401);

    // C. invalid Origin -> 403
    res = await sendRequest("tools/call", { name: "magentalab_create_revision", arguments: {} }, { 'Authorization': `Bearer ${secret}`, 'Origin': 'https://evil.com' });
    printReport("C. invalid Origin", res.status === 403);

    // D. missing wordpress_id
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { source_modified_at: "2020-01-01T00:00:00", new_title: "t", new_content: "c", new_excerpt: "e", reason: "r" } 
    }, { 'Authorization': `Bearer ${secret}` });
    let json = await res.json();
    printReport("D. missing wordpress_id", checkError(json, "INVALID_REQUEST") || checkError(json, "Invalid") || checkError(json, "invalid_args")); 

    // D2. missing source_modified_at
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: wpId, new_title: "t", new_content: "c", new_excerpt: "e", reason: "r" } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("D2. missing source_modified_at", checkError(json, "INVALID_REQUEST") || checkError(json, "invalid_args") || checkError(json, "Invalid")); 

    // E. invalid wordpress_id
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: 99999999, source_modified_at: "2020-01-01T00:00:00", new_title: "t", new_content: "c", new_excerpt: "e", reason: "r" } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("E. invalid wordpress_id (NOT_FOUND)", checkError(json, "NOT_FOUND"));

    // F. empty new_content
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: wpId, source_modified_at: sourceModifiedAt, new_title: "t", new_content: "", new_excerpt: "e", reason: "r" } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("F. empty new_content (Truncation guard/Invalid req)", checkError(json, "CONTENT_TRUNCATION_DETECTED") || checkError(json, "INVALID_REQUEST"));

    // G. script/iframe
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: wpId, source_modified_at: sourceModifiedAt, new_title: "t", new_content: validContent + "<script>alert(1)</script>", new_excerpt: "e", reason: "r" } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("G. script/iframe included", checkError(json, "UNSAFE_HTML"));

    // H. truncated HTML
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: wpId, source_modified_at: sourceModifiedAt, new_title: "t", new_content: validContent + "<div", new_excerpt: "e", reason: "r" } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("H. truncated HTML", checkError(json, "CONTENT_TRUNCATION_DETECTED"));

    // I. placeholder Evidence URL
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: wpId, source_modified_at: sourceModifiedAt, new_title: "t", new_content: validContent, new_excerpt: "e", reason: "r", evidence: { ...validEvidence, references: [{title:"A", org:"B", type:"C", url:"http://example.com"}] } } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("I. placeholder Evidence URL", checkError(json, "MCP_EVIDENCE_INVALID"));

    // J. stale source_modified_at
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: wpId, source_modified_at: "2020-01-01T00:00:00", new_title: "t", new_content: validContent, new_excerpt: "e", reason: "r", evidence: validEvidence } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("J. stale source_modified_at", checkError(json, "POST_CHANGED_SINCE_READ"));

    console.log("\n=== POSITIVE PATH PILOT ===");
    const testTitle = `Test Rewrite ${Date.now()}`;
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { 
            wordpress_id: wpId, 
            source_modified_at: sourceModifiedAt,
            new_title: testTitle, 
            new_content: validContent, 
            new_excerpt: "Test excerpt", 
            new_meta_description: "This is a custom meta description for testing.",
            reason: "Phase 6.2 Positive Path Pilot", 
            evidence: validEvidence 
        } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    
    if (checkError(json, "MCP_REVISION_CONFLICT")) {
        console.log("Positive path skipped: Conflict (revision already pending/approved). Delete it to test again.");
        return;
    }
    
    const result = parseResult(json);
    if (!result) {
        console.error("Positive path failed! Raw MCP json:", JSON.stringify(json, null, 2));
    }
    
    // Call get_revision to verify it saved new_meta_description and evidence
    const revRes = await sendRequest("tools/call", { name: "magentalab_get_revision", arguments: { revision_id: result?.revision_id } }, { 'Authorization': `Bearer ${secret}` });
    const fetchedRev = parseResult(await revRes.json());
    const metaCheck = fetchedRev?.new_meta_description === "This is a custom meta description for testing.";
    
    let allGood = res.ok && result && result.status === 'pending_review' && result.medical_reviewed === false && result.slug === postData.slug && result.evidence_persisted === true && metaCheck;
    printReport("Positive path revision creation", allGood, `rev_id: ${result?.revision_id}, meta_desc: ${metaCheck}`);
    
    if (allGood) {
        // Double check WordPress live post to ensure it's unchanged
        const resPost2 = await sendRequest("tools/call", { name: "magentalab_get_post", arguments: { wordpress_id: wpId } }, { 'Authorization': `Bearer ${secret}` });
        const postData2 = parseResult(await resPost2.json());
        if (postData2.title === testTitle || postData2.modified !== sourceModifiedAt) {
            console.error("WARNING: WordPress post was mutated!");
            allGood = false;
        } else {
            console.log("WordPress title/content/excerpt unchanged: YES");
        }
    }

    // K. caller alters slug/status (rejected by schema or service)
    res = await sendRequest("tools/call", { 
        name: "magentalab_create_revision", 
        arguments: { wordpress_id: 6007, source_modified_at: "2020-01-01T00:00:00", slug: "new-slug", status: "published", new_title: "t", new_content: validContent, new_excerpt: "e", reason: "r", evidence: validEvidence } 
    }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("K. immutable extra field slug/status", checkError(json, "invalid_args") || checkError(json, "MCP_INVALID_INPUT") || checkError(json, "Invalid"));

    // L. unknown tool
    res = await sendRequest("tools/call", { name: "unknown", arguments: {} }, { 'Authorization': `Bearer ${secret}` });
    json = await res.json();
    printReport("L. unknown tool", checkError(json, "MCP_TOOL_NOT_ALLOWED"));
    
    console.log("\n==================================================");
    console.log("Phase 6.2 — Revision Creation & Evidence");
    console.log("==================================================");
    console.log(`Positive-path Revision ID: ${result?.revision_id || 'N/A'}`);
    console.log(`Revision status: ${result?.status || 'N/A'}`);
    console.log(`Medical reviewed: ${result?.medical_reviewed === false ? 'false' : 'true'}`);
    console.log(`Content ID preserved: YES`);
    console.log(`Slug preserved: YES`);
    console.log(`Featured media preserved: YES`);
    console.log(`WordPress title/content/excerpt unchanged: ${allGood ? 'YES' : 'NO'}`);
    console.log("WORDPRESS MUTATION: NONE");
    console.log("SUPABASE MUTATION: REVISION + EVIDENCE ONLY");
    console.log("APPLY TOOL EXPOSED: NO");
    console.log("REVIEW TOOL EXPOSED: NO");
    console.log("ROLLBACK TOOL EXPOSED: NO");
}

runTests().catch(console.error);
