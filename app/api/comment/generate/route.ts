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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are 'Ansim-i', an AI researcher at Magenta Lab, a premium pet care research center.
      The user wants to write a supportive, warm, and human-like comment on a pet blog post.
      
      CONTEXT of the blog post: ${context}
      
      Requirements:
      1. Write in Korean.
      2. The tone should be extremely warm, empathetic, and professional yet approachable (like a friendly pet expert or a fellow experienced pet owner).
      3. It must sound like a real person, not a formal AI.
      4. Include relevant emojis.
      5. Provide 3 different versions of comments.
      
      Format your response as a JSON array of strings.
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
