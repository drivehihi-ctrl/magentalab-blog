import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const endpoint = 'http://localhost:3000/api/mcp';
const secret = process.env.AI_CONTENT_API_SECRET;

async function sendRequest(method, params = {}) {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
            'Authorization': `Bearer ${secret}`
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: Math.random().toString(36).substr(2, 9),
            method,
            params
        })
    });
    
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    return await res.json();
}

async function testAuth() {
    console.log("=== Test 1: Invalid Auth ===");
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer invalid_secret`
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: "1", method: "initialize", params: {} })
    });
    console.log("Status code for invalid auth:", res.status);
    console.assert(res.status === 401, "Should be 401");
    console.log("Pass\n");
}

async function testInitAndList() {
    console.log("=== Test 2: Initialize ===");
    const initRes = await sendRequest("initialize", {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" }
    });
    console.log("Init response:", JSON.stringify(initRes, null, 2));
    console.assert(initRes.result.protocolVersion, "Should have protocolVersion");
    console.log("Pass\n");

    console.log("=== Test 3: List Tools ===");
    const listRes = await sendRequest("tools/list");
    console.log("List tools response:", JSON.stringify(listRes, null, 2));
    console.assert(listRes.result.tools.length > 0, "Should have tools");
    console.log("Pass\n");
}

async function runAll() {
    try {
        await testAuth();
        await testInitAndList();
        console.log("All tests completed successfully!");
    } catch (e) {
        console.error("Test failed:", e);
    }
}

runAll();
