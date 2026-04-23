import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { context } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google API Key is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are 'Ansim-i', an AI assistant helping a blog owner generate realistic-looking comments to make their pet blog look active, popular, and trustworthy.
      The goal is to create comments that sound like real pet owners (e.g., busy workers, enthusiastic dog moms, cat lovers) are visiting and interacting.
      
      CONTEXT of the blog post: ${context}
      
      Requirements:
      1. Write in Korean.
      2. Generate 5 different comments from 5 different personas.
      3. For each comment, assign a creative pet-owner nickname (e.g., 초코맘, 냥이집사, 보리바라기, 개육아중, 멍뭉친구 등).
      4. Tones must vary:
         - Person A: Highly enthusiastic with many emojis.
         - Person B: Shares a tiny bit of personal experience (e.g., "우리 아이도 지난번에 이랬는데...").
         - Person C: Asks a simple follow-up question to encourage more talk.
         - Person D: Brief but impactful (e.g., "와 진짜 꿀팁! 당장 저장합니다 ㅎㅎ").
         - Person E: Emotional, warm, and heartwarming.
      5. Use natural Korean internet slang/tone appropriate for pet communities (e.g., ~네요, ~요!, ㅎㅎ, ㅠㅠ).
      
      Format your response as a JSON array of objects: [{"nickname": "...", "content": "..."}]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the text if it contains markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const comments = JSON.parse(cleanedText);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate comments." },
      { status: 500 }
    );
  }
}
